import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { OfferedCourse } from "../offeredCourse/offeredCourse.model";
import { TEnrolledCourse } from "./enrolledCourse.interface";
import { Student } from "../student.model";
import { EnrolledCourse } from "./enrolledCourse.model";
import { Course } from "../course/course.model";
import { SemesterRegistration } from "../semesterRegistration/semesterRegistration.model";
import mongoose from "mongoose";
import { Faculty } from "../faculty/faculty.model";
import { calculateGradeAndPoints } from "./enrolledCourse.utils";
import QueryBuilder from "../../builder/QueryBuilder";

const createEnrolledCourseIntoDB = async (userId: string, payload: TEnrolledCourse) => {
    /*step 01 : check if the offered course does exist
    *step 02 : check if the student is already enrolled
    *step 03 : check if the max credit exceeds
    */

    const { offeredCourse } = payload;

    const isOfferedCourseExist = await OfferedCourse.findById(offeredCourse);
    if(!isOfferedCourseExist){
        throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found!');
    }

    if(isOfferedCourseExist.maxCapacity <= 0){
        throw new AppError(httpStatus.BAD_GATEWAY,'Room is full!');
    };

    const student = await Student.findOne({ id: userId }, { _id:1 });

    if(!student){
        throw new AppError(httpStatus.NOT_FOUND,'Student not found');
    };

    const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
        semesterRegistration:isOfferedCourseExist?.semesterRegistration,
        offeredCourse,
        student:student._id,
    });

    if(isStudentAlreadyEnrolled){
        throw new AppError(httpStatus.CONFLICT, 'Student is already enrolled!');
    }

    // //checking total credits exceed the maxCredit or not
    const course = await Course.findById(isOfferedCourseExist?.course);
    const currentCredit = course?.credits;

    const semesterRegistration = await SemesterRegistration.findById(
        isOfferedCourseExist.semesterRegistration
    ).select('maxCredit');

    const maxCredit = semesterRegistration?.maxCredit;

    const enrolledCourses = await EnrolledCourse.aggregate([
        {
            $match: {
                semesterRegistration : isOfferedCourseExist.semesterRegistration,
                student: student._id,
            },
        },
        {
            $lookup: {
                from: 'courses',
                localField: 'course',
                foreignField: '_id',
                as: 'enrolledCourseData',
            },
        },
        {
            $unwind: '$enrolledCourseData',
        },
        {
            $group: {
              _id: null,
              totalEnrolledCredits: { $sum: '$enrolledCourseData.credits' },
            },
          },
          {
            $project: {
              _id: 0,
              totalEnrolledCredits: 1,
            },
          },
    ]);

    //total enrolled credits + new enrolled course credits > maxCredit
    const totalCredits = enrolledCourses.length > 0 ? enrolledCourses[0].totalEnrolledCredits : 0;
    if(totalCredits && maxCredit && totalCredits + currentCredit > maxCredit){
        throw new AppError(httpStatus.BAD_REQUEST,'You have exceeded maximum number of credits!');
    };


    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const result = await EnrolledCourse.create(
            [
                {
                semesterRegistration: isOfferedCourseExist.semesterRegistration,
                academicSemester: isOfferedCourseExist.academicSemester,
                academicFaculty: isOfferedCourseExist.academicFaculty,
                academicDepartment: isOfferedCourseExist.academicDepartment,
                offeredCourse: offeredCourse,
                course: isOfferedCourseExist.course,
                student: student._id,
                faculty: isOfferedCourseExist.faculty,
                isEnrolled: true,
                }
            ],
            { session }
        );

        if(!result){
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to enroll in this course!');
        };

        const maxCapacity = isOfferedCourseExist.maxCapacity;
        await OfferedCourse.findByIdAndUpdate(offeredCourse, {
            maxCapacity: maxCapacity - 1,
        });

        await session.commitTransaction();
        await session.endSession();
        return result;
    } catch (error:any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(error);
    }

};

const getMyEnrolledCoursesFromDb = async( studentId: string, query: Record<string, unknown> ) => {
    const student = await Student.findOne({ _id: studentId });
    if(!student){
        throw new AppError(httpStatus.NOT_FOUND, 'Student not found');
    }

    const enrolledCourseQuery = new QueryBuilder(
        EnrolledCourse.find({ student: student._id }).populate(
            'semesterRegistration academicSemester academicFaculty academicDepartment offeredCourse course student faculty',
        ),
        query,
    )
    .filter()
    .sort()
    .paginate()
    .fields();

    const result = await enrolledCourseQuery.modelQuery;
    const meta = await enrolledCourseQuery.countTotal();

    return {
        meta,
        result
    };


};

const updateCourseMarksIntoDB = async(facultyId: string, payload: Partial<TEnrolledCourse>) =>{
    const { semesterRegistration, offeredCourse, student, courseMarks } = payload;

    const isSemesterRegistrationExists = await SemesterRegistration.findById(semesterRegistration);

    if(!isSemesterRegistrationExists){
        throw new AppError(httpStatus.NOT_FOUND,'Semester registration not found!');
    }

    const isOfferedCourseExist = await OfferedCourse.findById(offeredCourse);
    if(!isOfferedCourseExist){
        throw new AppError(httpStatus.NOT_FOUND,'Offered course not found!');
    }

    const isStudentExists = await Student.findById(student);
    if(!isStudentExists){
        throw new AppError(httpStatus.NOT_FOUND,'Student not found!');
    }

    const faculty = await Faculty.findOne({ id : facultyId}, {_id : 1});
    if(!faculty){
        throw new AppError(httpStatus.NOT_FOUND,'Faculty not found!!');
    };

    const isCourseBelongToFaculty = await EnrolledCourse.findOne({
        semesterRegistration,
        offeredCourse,
        student,
        faculty: faculty._id,
      });
    
      if (!isCourseBelongToFaculty) {
        throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!');
      };

      const modifiedData : Record<string, unknown> = { ...courseMarks };
      if(courseMarks?.finalTerm){
        const { classTest1, classTest2, midTerm, finalTerm } = isCourseBelongToFaculty.courseMarks;
        const totalMarks =
        Math.ceil(classTest1) +
        Math.ceil(midTerm) +
        Math.ceil(classTest2) +
        Math.ceil(finalTerm);
  
      const result = calculateGradeAndPoints(totalMarks);
  
      modifiedData.grade = result.grade;
      modifiedData.gradePoints = result.gradePoints;
      modifiedData.isCompleted = true;
      }

      if (courseMarks && Object.keys(courseMarks).length) {
        for (const [key, value] of Object.entries(courseMarks)) {
          modifiedData[`courseMarks.${key}`] = value;
        }
      }

      const result = await EnrolledCourse.findByIdAndUpdate(
        isCourseBelongToFaculty._id,
        modifiedData,
        { new: true }
      );

      return result;

};

export const EnrolledCourseServices = {
    createEnrolledCourseIntoDB,
    getMyEnrolledCoursesFromDb,
    updateCourseMarksIntoDB,
};
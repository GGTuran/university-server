import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { OfferedCourse } from "../offeredCourse/offeredCourse.model";
import { TEnrolledCourse } from "./enrolledCourse.interface";
import { Student } from "../student.model";
import { EnrolledCourse } from "./enrolledCourse.model";
import { Course } from "../course/course.model";
import { SemesterRegistration } from "../semesterRegistration/semesterRegistration.model";
import mongoose from "mongoose";

const createEnrolledCourseIntoDB = async (userId: string, payload: TEnrolledCourse) => {
    /*step 01 : check if the offered course does exist
    *step 02 : check if the student is already enrolled
    *
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
    // const course = await Course.findById(isOfferedCourseExist?.course);
    // const currentCredit = course?.credits;

    // const semesterRegistration = await SemesterRegistration.findById(
    //     isOfferedCourseExist.semesterRegistration
    // ).select('maxCredit');

    // const maxCredit = semesterRegistration?.maxCredit;

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

export const EnrolledCourseServices = {
    createEnrolledCourseIntoDB,
}
import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { CourseSearchableFields } from "./course.constants";
import { TCourse, TCourseFaculty } from "./course.interface";
import { Course, CourseFaculty } from "./course.model"
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createCourseIntoDB = async (payload: TCourse) => {
    const result = await Course.create(payload);
    return result;
};

const getAllCourseFromDB = async (query: Record<string, unknown>) => {
    const courseQuery = new QueryBuilder(Course.find().populate('preRequisiteCourses.course'), query)
        .search(CourseSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await courseQuery.modelQuery;
    const meta = await courseQuery.countTotal();
    return {
        meta,
        result
    };
};

const getSingleCourseFromDB = async (id: string) => {
    const result = await Course.findById(id).populate('preRequisiteCourses.course');
    return result;
};

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
    const { preRequisiteCourses, ...courseRemainingData } = payload;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        //step-1:update basic course info
        const updateBasicCourseInfo = await Course.findByIdAndUpdate(
            id,
            courseRemainingData,
            { new: true, runValidators: true, session }
        );

        if (!updateBasicCourseInfo) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course!!')
        }


        //checking if there is any preRequisite courses to update
        if (preRequisiteCourses && preRequisiteCourses.length > 0) {
            const deletePreRequisites = preRequisiteCourses.filter((elem) => elem.course && elem.isDeleted)
                .map((elem) => elem.course);

            const deletePreRequisiteCourses = await Course.findByIdAndUpdate(id, {
                $pull: { preRequisiteCourses: { course: { $in: deletePreRequisites } } }
            },
                {
                    new: true, runValidators: true, session
                }
            );

            if (!deletePreRequisiteCourses) {
                throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course!!')
            }
            //checking again to filter out the new course fields
            const newPreRequisites = preRequisiteCourses?.filter(
                (elem) => elem.course && !elem.isDeleted,
            );

            const newPreRequisiteCourses = await Course.findByIdAndUpdate(id, {
                $addToSet: { preRequisiteCourses: { $each: newPreRequisites } }
            },
                { new: true, runValidators: true, session }
            );

            if (!newPreRequisiteCourses) {
                throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course!!')
            }

        }

        await session.commitTransaction();
        await session.endSession();

        const result = await Course.findById(id).populate('preRequisiteCourses.course');
        return result;
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course!!')
    }

};

const deleteCourseFromDB = async (id: string) => {
    const result = await Course.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
    )
    return result;
};

const assignFacultiesWithCourseIntoDB = async (id: string, payload: Partial<TCourseFaculty>) => {
    const result = await CourseFaculty.findByIdAndUpdate(
        id,
        {
            course: id,
            $addToSet: { faculties: { $each: payload } },
        },
        {
            upsert: true,
            new: true
        },
    );
    return result;
};

const getFacultiesFromCourseFromDB = async (courseId: string,) => {
    const result = await CourseFaculty.findOne({ course: courseId }).populate('faculties');
    return result;
};

const removeFacultiesFromCourseFromDB = async (id: string, payload: Partial<TCourseFaculty>) => {
    const result = await CourseFaculty.findByIdAndUpdate(
        id,
        {
            $pull: { faculties: { $in: payload } }
        },
        {
            new: true
        },
    );
    return result;
}

export const CourseServices = {
    createCourseIntoDB,
    getAllCourseFromDB,
    getSingleCourseFromDB,
    updateCourseIntoDB,
    deleteCourseFromDB,
    assignFacultiesWithCourseIntoDB,
    getFacultiesFromCourseFromDB,
    removeFacultiesFromCourseFromDB,
}
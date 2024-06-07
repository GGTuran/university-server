import QueryBuilder from "../../builder/QueryBuilder";
import { CourseSearchableFields } from "./course.constants";
import { TCourse } from "./course.interface";
import { Course } from "./course.model"

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
    return result;
};

const getSingleCourseFromDB = async (id: string) => {
    const result = await Course.findById(id).populate('preRequisiteCourses.course');
    return result;
};

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
    const { preRequisiteCourses, ...courseRemainingData } = payload;

    //step-1:update basic course info
    const updateBasicCourseInfo = await Course.findByIdAndUpdate(
        id,
        courseRemainingData,
        { new: true, runValidators: true }
    );


    //checking if there is any preRequisite courses to update
    if(preRequisiteCourses && preRequisiteCourses.length > 0){
        const deletePreRequisites = preRequisiteCourses.filter((elem) => elem.course && elem.isDeleted)
        .map((elem)=>elem.course);

        const deletePreRequisiteCourses = await Course.findByIdAndUpdate(id,{
            $pull: { preRequisiteCourses: {course : { $in: deletePreRequisites } } }
        });

        //checking again to filter out the new course fields
        const newPreRequisites = preRequisiteCourses?.filter(
            (elem)=>elem.course && !elem.isDeleted,
        );

        const newPreRequisiteCourses = await Course.findByIdAndUpdate(id,{
            $addToSet: { preRequisiteCourses:{$each : newPreRequisites} }
         });
    }

    const result = await Course.findById(id).populate('preRequisiteCourses.course');
    return result;
};

const deleteCourseFromDB = async (id: string) => {
    const result = await Course.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
    )
    return result;
};

export const CourseServices = {
    createCourseIntoDB,
    getAllCourseFromDB,
    getSingleCourseFromDB,
    updateCourseIntoDB,
    deleteCourseFromDB,
}
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { EnrolledCourseServices } from "./enrolledCourseService";

const createEnrolledCourse = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const result = await EnrolledCourseServices.createEnrolledCourseIntoDB(userId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student is enrolled successfully!',
        data: result,
    })
});

const updateCourseMarks = catchAsync(async(req, res)=> {
    const facultyId = req.user.userId;
    const result = await EnrolledCourseServices.updateCourseMarksIntoDB( facultyId, req.body );
    sendResponse(res,{
        statusCode: httpStatus.OK,
        success: true,
        message: 'Course marks are updated successfully!',
        data: result,
    })
});

export const EnrolledCourseControllers = {
    createEnrolledCourse,
    updateCourseMarks,
};
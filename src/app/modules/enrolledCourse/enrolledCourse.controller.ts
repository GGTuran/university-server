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

const getMyEnrolledCourses = catchAsync(async (req, res) => {
    const studentId = req.user.userId;

    const result = await EnrolledCourseServices.getMyEnrolledCoursesFromDb(studentId, req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Enrolled courses are retrieved successfully!',
        meta: result.meta,
        data: result.result,
    });
});

const updateCourseMarks = catchAsync(async (req, res) => {
    const facultyId = req.user.userId;
    const result = await EnrolledCourseServices.updateCourseMarksIntoDB(facultyId, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Course marks are updated successfully!',
        data: result,
    })
});

export const EnrolledCourseControllers = {
    createEnrolledCourse,
    getMyEnrolledCourses,
    updateCourseMarks,
};
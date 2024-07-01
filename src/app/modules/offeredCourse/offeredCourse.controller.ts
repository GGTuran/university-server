import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OfferedCourseServices } from "./offeredCourseService";

const createOfferedCourse = catchAsync(async (req, res) => {
    const result = await OfferedCourseServices.createOfferedCourseIntoDB(
        req.body,
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Offered Course is created successfully!',
        data: result,
    });
});

const getAllOfferedCourse = catchAsync(async (req, res) => {
    const result = await OfferedCourseServices.getAllOfferedCourseFromDB(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Offered Course are retrieved successfully!',
        meta: result.meta,
        data: result.result,
    });
});

const getSingleOfferedCourse = catchAsync(async(req,res)=>{
    const { id } = req.params;
    const result = await OfferedCourseServices.getSingleOfferedCourseFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Offered Course is retrieved successfully!',
        data: result,
      });
});

const updateOfferedCourse = catchAsync(async(req,res)=>{
    const { id } = req.params;
    const result = await OfferedCourseServices.updateOfferedCourseIntoDb(id,req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Offered Course is updated successfully!',
        data: result,
      });
});

const deleteOfferedCourse = catchAsync(async(req,res)=>{
    const { id } = req.params;
    const result = await OfferedCourseServices.deleteOfferedCourseFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Offered Course is deleted successfully!',
        data: result,
      });
});

const getMyOfferedCourse = catchAsync(async(req,res)=>{
    const userId = req.user.userId;
    const result = await OfferedCourseServices.getMyOfferedCourseFromDB(userId, req.query);
    sendResponse(res,{
        statusCode: httpStatus.OK,
        success: true,
        message: 'OfferedCourses retrieved successfully!',
        meta: result.meta,
        data: result.result,
    })
})

export const OfferedCourseControllers = {
    createOfferedCourse,
    getAllOfferedCourse,
    getSingleOfferedCourse,
    updateOfferedCourse,
    deleteOfferedCourse,
    getMyOfferedCourse,
}
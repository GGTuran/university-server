import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AcademicDepartmentServices } from "./academicDepartmentService";

const createAcademicDepartment = catchAsync(async (req, res) => {
    const result = await AcademicDepartmentServices.createAcademicDepartmentIntoDB(req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Academic department is created successfully!!',
        data: result,
    });
});

const getAllAcademicDepartment = catchAsync(async (req, res) => {
    const result = await AcademicDepartmentServices.getAllAcademicDepartmentFromDB();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Academic departments are retrieved successfully!!',
        data: result,
    });
});

const getSingleDepartment = catchAsync(async (req, res) => {
    const { departmentId } = req.params;
    const result = await AcademicDepartmentServices.getSingleDepartmentFromDB(departmentId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Academic department is retrieved successfully!!',
        data: result,
    });
});

const updateAcademicDepartment = catchAsync(async (req, res) => {
    const { departmentId } = req.params;
    const updatedData = req.body;
    const result = await AcademicDepartmentServices.updateAcademicDepartmentIntoDB(departmentId, updatedData);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Academic department is updated successfully!!',
        data: result,
    });
});

export const AcademicDepartmentController = {
    createAcademicDepartment,
    getAllAcademicDepartment,
    getSingleDepartment,
    updateAcademicDepartment,
}
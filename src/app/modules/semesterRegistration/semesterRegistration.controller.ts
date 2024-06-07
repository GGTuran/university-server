import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SemesterRegistrationServices } from "./semesterRegistrationService";

const createSemesterRegistration = catchAsync(async(req,res)=>{
    const result = await SemesterRegistrationServices.createSemesterRegistrationIntoDB(req.body);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Semester is registered successfully!',
        data:result
    });
});

const getAllSemesterRegistration = catchAsync(async(req,res)=>{
    const result = await SemesterRegistrationServices.getAllSemesterRegistrationFromDB(req.query);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Semester registrations are retrieved successfully!!',
        data:result,
    });
});

const getSingleSemesterRegistration = catchAsync(async(req,res)=>{
    const { id } = req.params;
    const result = await SemesterRegistrationServices.getSingleSemesterRegistrationFRomDB(id);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Semester registration is retrieved successfully!',
        data:result
    });
});

const updateSemesterRegistration = catchAsync(async(req,res)=>{
    const { id } = req.params;
    const result = await SemesterRegistrationServices.updateSemesterRegistrationIntoDB(id, req.body);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Semester is updated successfully!!',
        data:result
    });
});

export const SemesterRegistrationControllers = {
    createSemesterRegistration,
    getAllSemesterRegistration,
    getSingleSemesterRegistration,
    updateSemesterRegistration,
}
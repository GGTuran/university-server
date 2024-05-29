import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AcademicFacultyServices } from "./academicFacultyService";

const createAcademicFaculty = catchAsync(async(req,res)=>{
    const result = await AcademicFacultyServices.createAcademicFacultyIntoDB(req.body);
    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:'Academic faculty is created successfully!!',
        data:result,
    });
});

const getAllAcademicFaculty = catchAsync(async(req,res)=>{
    const result = await AcademicFacultyServices.getAllAcademicFacultyFromDB();
    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:'Academic faculties are retrieved successfully!!',
        data:result,
    });
});

const getSingleAcademicFaculty = catchAsync(async(req,res)=>{
    const { facultyId } = req.params;
    const result = await AcademicFacultyServices.getSingleAcademicFacultyFromDB(facultyId);
    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:'Academic faculty is retrieved successfully!!',
        data:result,
    });
});

const updateAcademicFaculty = catchAsync(async(req,res)=>{
    const { facultyId } = req.params;
    const updatedData =  req.body;
    const result = await AcademicFacultyServices.updateAcademicFacultyIntoDB(facultyId, updatedData);
    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:'Academic faculty is updated successfully!!',
        data:result,
    });
});

export const AcademicFacultyControllers = {
    createAcademicFaculty,
    getAllAcademicFaculty,
    getSingleAcademicFaculty,
    updateAcademicFaculty,
};
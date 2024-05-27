import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AcademicSemesterServices } from "./academicSemesterService";

const createAcademicSemester = catchAsync(async (req, res) => {
    const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Academic semester is created successfully!!',
        data: result,
    })
});

const getAllAcademicSemester = catchAsync(async (req, res) => {
    const result = await AcademicSemesterServices.getAllAcademicSemesterFromDB();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Academic Semesters are retrieved successfully!',
        data: result,
    });
});

const getSingleAcademicSemester = catchAsync(async(req, res)=>{
    const { semesterId } = req.params;
    const result = await AcademicSemesterServices.getSingleAcademicSemesterFromDB(semesterId);
    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:'Academic semester is retrieved successfully!',
        data:result,
    });
});

const updateAcademicSemester = catchAsync(async(req, res)=>{
    const { semesterId } = req.params;
    const updatedData = req.body;
    const result = await AcademicSemesterServices.updateAcademicSemesterIntoDB(semesterId, updatedData);
    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:'Academic semester is retrieved successfully!!',
        data:result,
    })
})


export const AcademicSemesterControllers = {
    createAcademicSemester,
    getAllAcademicSemester,
    getSingleAcademicSemester,
    updateAcademicSemester,
}
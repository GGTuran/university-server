import { UserService } from "./userService";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";

const createStudent = catchAsync(async (req, res, next) => {

    const { password, student: studentData } = req.body;

    const result = await UserService.createUserIntoDb(password, studentData);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Student is created successfully!!',
        data: result,
    })

});

const createFaculty = catchAsync(async(req,res)=>{
    const { password, faculty:facultyData } = req.body;
    const result = await UserService.createFacultyIntoDB(password, facultyData);

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Faculty is created successfully!',
        data:result,
    });
});

const createAdmin = catchAsync(async (req, res) => {
    const { password, admin: adminData } = req.body;
  
    const result = await UserService.createAdminIntoDb(password, adminData);
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin is created successfully',
      data: result,
    });
  });

export const userController = {
    createStudent,
    createFaculty,
    createAdmin,
}
import { UserService } from "./userService";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../errors/AppError";

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

  const getMe = catchAsync(async(req,res)=>{
    // const token = req.headers.authorization;
    // if(!token){
    //     throw new AppError(httpStatus.NOT_FOUND,'You have no access!!')
    // };

    // console.log(req.user)
    const { userId,role } = req.user;
    const result : any = await UserService.getMeFromDB(userId,role);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User is retrieved successfully',
        data: result,
      });

  });

  const changeStatus = catchAsync(async(req,res)=>{
    const id = req.params.id;

    const result = await UserService.changeStatusIntoDB(id,req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User status is updated successfully',
        data: result,
      });
  })

export const userController = {
    createStudent,
    createFaculty,
    createAdmin,
    getMe,
    changeStatus,
};
import Joi from 'joi';
import { Request, Response } from "express";
import { studentServices } from "./studentService";
// import studentJoiSchema from './student.validationJoi';
import { z } from "zod";
// import studentZodSchema from './studentValidationZod';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';


// const createStudent = async (req: Request, res: Response) => {
//     try {

//         const { student: studentData } = req.body;

//         //validating using zod
//         // const zodSchema = z.object({
//         //     id:z.string(),
//         //     name:z.object({
//         //         firstName:z.string().max(20, {message:'First name can not be more than 20 characters'})
//         //     }),
//         // });

//         const ZodValidation = studentZodSchema.parse(studentData)

//         //need to call service function
//         const result = await studentServices.createStudentIntoDB(ZodValidation);
        
//         //validating the joi schema
        
//         // const { error, value } = studentJoiSchema.validate(studentData);
//         // const result = await studentServices.createStudentIntoDB(value);

//         // console.log(error, value);
//         // if (error) {
//         //     res.status(500).json({
//         //         success: false,
//         //         message: "Something went wrong",
//         //         error:error.message

//         //     });
//         // }


//         //send response
//         res.status(200).json({
//             success: true,
//             message: 'Student data is created',
//             data: result,
//         });
//     } catch (error : any) {
//         res.status(500).json({
//             success: false,
//             message: error.message || "Something went wrong",
//             error: error,

//         });
//     }
// }

const getAllStudents = catchAsync(async (req, res) => {
    
   

    const result = await studentServices.getAllStudentsFromDB(req.query);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Students are retrieved successfully!!',
        data:result,
    })

});

const getSingleStudent = catchAsync(async (req: Request, res: Response) => {
    
    const { studentId } = req.params;
    const result = await studentServices.getSingleStudentFromDB(studentId);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Student is retrieved successfully!!',
        data:result,
    })

});

const updateStudent = catchAsync(async(req,res)=>{
    const { studentId } = req.params;
    const { student } = req.body;
    const result = await studentServices.updateSingleStudentIntoDB(studentId, student);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Student is updated',
        data:result,
    });
});

const deleteStudent = catchAsync(async ( req:Request , res: Response ) =>{
    
    const { studentId } = req.params;
    const result = await studentServices.deleteStudentFromDB(studentId);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Student is deleted successfully',
        data:result,
    })
    
});


export const studentControllers = {
    // createStudent,
    getAllStudents,
    getSingleStudent,
    deleteStudent,
    updateStudent,
}
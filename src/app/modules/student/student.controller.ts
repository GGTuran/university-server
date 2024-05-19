import Joi from 'joi';
import { Request, Response } from "express";
import { studentServices } from "./studentService";
// import studentJoiSchema from './student.validationJoi';
import { z } from "zod";
import studentZodSchema from './studentValidationZod';


const createStudent = async (req: Request, res: Response) => {
    try {






        const { student: studentData } = req.body;


        //validating using zod
        // const zodSchema = z.object({
        //     id:z.string(),
        //     name:z.object({
        //         firstName:z.string().max(20, {message:'First name can not be more than 20 characters'})
        //     }),
        // });

        const ZodValidation = studentZodSchema.parse(studentData)

        //need to call service function
        const result = await studentServices.createStudentIntoDB(ZodValidation);
        
        //validating the joi schema
        
        // const { error, value } = studentJoiSchema.validate(studentData);
        // const result = await studentServices.createStudentIntoDB(value);

        // console.log(error, value);
        // if (error) {
        //     res.status(500).json({
        //         success: false,
        //         message: "Something went wrong",
        //         error:error.message

        //     });
        // }





        //send response
        res.status(200).json({
            success: true,
            message: 'Student data is created',
            data: result,
        });
    } catch (error : any) {
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong",
            error: error,

        });
    }
}

const getAllStudents = async (req: Request, res: Response) => {
    try {
        const result = await studentServices.getAllStudentsFromDB();
        res.status(200).json({
            success: true,
            message: 'Getting all the students',
            data: result,
        });
    } catch (error : any) {
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong",
            error: error,

        });
    }
};

const getSingleStudent = async (req: Request, res: Response) => {
    try {
        const { studentId } = req.params;
        const result = await studentServices.getSingleStudentFromDB(studentId);
        res.status(200).json({
            success: true,
            message: "Got the one",
            data: result,
        });
    } catch (error : any) {
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong",
            error: error,

        });
    }
}


export const studentControllers = {
    createStudent,
    getAllStudents,
    getSingleStudent,
}
import { Request, Response } from "express";
import { studentServices } from "./studentService";

const createStudent = async (req:Request,res:Response) =>{
try {
    const student = req.body;
    //need to call service function
    const result = await studentServices.createStudentIntoDB(student);
    //send response
    res.status(200).json({
        success:true,
        message:'Student data is created',
        data:result,
    });
} catch (error) {
    console.log(error);
}
}
export const studentControllers ={
    createStudent,
}
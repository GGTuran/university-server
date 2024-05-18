import Joi from 'joi';
import { Request, Response } from "express";
import { studentServices } from "./studentService";


const createStudent = async (req: Request, res: Response) => {
    try {

        //creating a schema using joi validation

        const JoiValidationSchema = Joi.object({
            id: Joi.string(),
            name: {
                firstName : Joi.string().max(20).required(),
                middleName : Joi.string().max(20),
                lastName: Joi.string().max(20).required()
            }

        })


        const { student: studentData } = req.body;




        //need to call service function
        const result = await studentServices.createStudentIntoDB(studentData);
        //send response
        res.status(200).json({
            success: true,
            message: 'Student data is created',
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
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
    } catch (error) {
        console.log(error)
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
    } catch (error) {
        console.log(error)
    }
}


export const studentControllers = {
    createStudent,
    getAllStudents,
    getSingleStudent,
}
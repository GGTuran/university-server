import { NextFunction, Request, Response } from "express";
import { UserService } from "./userService";

const createStudent = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const { password, student:studentData } = req.body;


        const result = await UserService.createUserIntoDb(password,studentData);
        res.status(200).json({
            success:true,
            message:'Student is created successfully',
            data:result,
        });
    } catch (error) {
        next(error);
    }
};

export const userController = {
    createStudent,
}
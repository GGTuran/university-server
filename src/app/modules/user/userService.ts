
import mongoose from "mongoose";
import config from "../../config";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { StudentModel } from "../student.model";
import { Student } from "../student/student.interface";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { generateStudentId } from "./user.utils";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createUserIntoDb = async (password: string, payload: Student) => {
    //create a user object
    const userData: Partial<TUser> = {};


    //if password is not given
    userData.password = password || (config.default_password as string);

    //set student role
    userData.role = 'student';

    //find academic semester info
    const admissionSemester = await AcademicSemester.findById(payload.admissionSemester);

    if (!admissionSemester) {
        throw new Error('Admission semester not found');
    }

    const session = await mongoose.startSession(); 

    try {
        session.startTransaction()
        //generate id
        userData.id = await generateStudentId(admissionSemester);

        //create a user(transaction-1)
        const newUser = await User.create([userData],{session});


        //create a student
        if (!newUser.length) {

            throw new AppError(httpStatus.BAD_REQUEST,'Failed to create a user')
        }
            //set id , _id as user
            payload.id = newUser[0].id;
            payload.user = newUser[0]._id;  // reference

            //create a student(transaction-2)
            const newStudent = await StudentModel.create([payload], {session});

            if(!newStudent.length){
                throw new AppError(httpStatus.BAD_REQUEST,'Failed to create a student')
            }
            await session.commitTransaction();
            await session.endSession();

            return newStudent;
        

    } catch (error) {
        // console.log(error)
        await session.abortTransaction()
        await session.endSession()
        throw new Error('Transaction error,failed to create a student')
    }




};

export const UserService = {
    createUserIntoDb,
}
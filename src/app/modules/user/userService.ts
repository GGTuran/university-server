
import mongoose from "mongoose";
import config from "../../config";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { StudentModel } from "../student.model";
import { Student } from "../student/student.interface";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { generateFacultyId, generateStudentId } from "./user.utils";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { TFaculty } from "../faculty/faculty.interface";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import { Faculty } from "../faculty/faculty.model";

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
        

    } catch (error:any) {
        // console.log(error)
        await session.abortTransaction()
        await session.endSession()
        throw new Error(error)
    }

};



const createFacultyIntoDB = async(password:string, payload:TFaculty) =>{
    //create a user object
    const userData: Partial<TUser> = {};

    //if password is given we have to use the default one
    userData.password = password || (config.default_password as string);

    //set user rule as faculty
    userData.role = 'faculty';

    //find academic department info
    const academicDepartment = await AcademicDepartment.findById(payload.academicDepartment);

    if(!academicDepartment){
        throw new AppError(400,'Academic department is not found');
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        //set generated id
        userData.id = await generateFacultyId();

        //create a user(transaction-1)
        const newUser = await User.create([userData], {session});

        //create a faculty
        if(!newUser.length){
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create a user');
        }

        //set id, _id as user
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id;

        //cerate a faculty(transaction-2)
        const newFaculty = await Faculty.create([payload], {session});

        if(!newFaculty.length){
            throw new AppError(httpStatus.BAD_REQUEST,'Failed to create a faculty');
        }

        await session.commitTransaction();
        await session.endSession();

        return newFaculty;
    } catch (error:any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(error);
    }
};

// const createAdminIntoDb = async(password:string, payload)


export const UserService = {
    createUserIntoDb,
    createFacultyIntoDB,
}
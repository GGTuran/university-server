/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import config from "../../config";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { Student } from "../student.model";
import { TStudent } from "../student/student.interface";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { generateAdminId, generateFacultyId, generateStudentId } from "./user.utils";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { TFaculty } from "../faculty/faculty.interface";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import { Faculty } from "../faculty/faculty.model";
import { TAdmin } from "../admin/admin.interface";
import { Admin } from "../admin/admin.model";
import { verifyToken } from "../auth/auth.utils";
import { sendImageToCloudinary } from "../../utils/imageToCloud";

const createUserIntoDb = async (file: any, password: string, payload: TStudent) => {
    //create a user object
    const userData: Partial<TUser> = {};


    //if password is not given
    userData.password = password || (config.default_password as string);

    //set student role
    userData.role = 'student';
    //set student email
    userData.email = payload.email;

    //find academic semester info
    const admissionSemester = await AcademicSemester.findById(payload.admissionSemester);
    // console.log(admissionSemester,'semester')
    if (!admissionSemester) {
        throw new Error('Admission semester not found');
    }

    //finding department 
    const academicDepartment = await AcademicDepartment.findById(payload.academicDepartment);
    if (!academicDepartment) {
        throw new AppError(httpStatus.NOT_FOUND, 'Academic department not found');
    }
    payload.academicFaculty = academicDepartment.academicFaculty;

    const session = await mongoose.startSession();

    try {
        session.startTransaction()
        //generate id
        userData.id = await generateStudentId(admissionSemester);

        if (file) {
            //path and name for image
            const imageName = `${userData.id}${payload?.name?.firstName}`;
            const path = file?.path;
            //send image to cloudinary
            const { secure_url } = await sendImageToCloudinary(imageName, path);
            //set profileImg
            payload.profileImg = secure_url as string;
        }



        //create a user(transaction-1)
        const newUser = await User.create([userData], { session });


        //create a student
        if (!newUser.length) {

            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create a user')
        }
        //set id , _id as user
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id;  // reference

        //create a student(transaction-2)
        const newStudent = await Student.create([payload], { session });

        if (!newStudent.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create a student')
        }
        await session.commitTransaction();
        await session.endSession();

        return newStudent;


    } catch (error: any) {
        // console.log(error)
        await session.abortTransaction()
        await session.endSession()
        throw new Error(error)
    }

};



const createFacultyIntoDB = async (file: any, password: string, payload: TFaculty) => {
    //create a user object
    const userData: Partial<TUser> = {};

    //if password is given we have to use the default one
    userData.password = password || (config.default_password as string);

    //set user rule as faculty
    userData.role = 'faculty';
    //set faculty email
    userData.email = payload.email;

    //find academic department info
    const academicDepartment = await AcademicDepartment.findById(payload.academicDepartment);

    if (!academicDepartment) {
        throw new AppError(400, 'Academic department is not found');
    }

    payload.academicFaculty = academicDepartment.academicFaculty;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        //set generated id
        userData.id = await generateFacultyId();
        if (file) {
            //path and name for image
            const imageName = `${userData.id}${payload?.name?.firstName}`;
            const path = file?.path;
            //send image to cloudinary
            const { secure_url }:any = await sendImageToCloudinary(imageName, path);
            //set profileImg
            payload.profileImg = secure_url;
        }

        //create a user(transaction-1)
        const newUser = await User.create([userData], { session });

        //create a faculty
        if (!newUser.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create a user');
        }

        //set id, _id as user
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id;
     

        //cerate a faculty(transaction-2)
        const newFaculty = await Faculty.create([payload], { session });

        if (!newFaculty.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create a faculty');
        }

        await session.commitTransaction();
        await session.endSession();

        return newFaculty;
    } catch (error: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(error);
    }
};

const createAdminIntoDb = async (file: any, password: string, payload: TAdmin) => {
    //create a user object
    const userData: Partial<TUser> = {};

    //if password is not given we will need to use default password
    userData.password = password || (config.default_password as string);
    //set student role
    userData.role = 'admin';
    //set admin email
    userData.email = payload.email;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        //set  generated id
        userData.id = await generateAdminId();
        if (file) {
            //path and name for image
            const imageName = `${userData.id}${payload?.name?.firstName}`;
            const path = file?.path;
            //send image to cloudinary
            const { secure_url }:any = await sendImageToCloudinary(imageName, path);
            //set profileImg
            payload.profileImg = secure_url;
        }

        // create a user (transaction-1)
        const newUser = await User.create([userData], { session });

        //create a admin
        if (!newUser.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
        }
        // set id , _id as user
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id; //reference _id

        // create a admin (transaction-2)
        const newAdmin = await Admin.create([payload], { session });

        if (!newAdmin.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
        }

        await session.commitTransaction();
        await session.endSession();

        return newAdmin;
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(err);
    };
};

const getMeFromDB = async (userId: string, role: string) => {


    let result = null;

    if (role === 'student') {
        result = await Student.findOne({ id: userId }).populate('user');;
    }
    if (role === 'admin') {
        result = await Admin.findOne({ id: userId }).populate('user');;
    };
    if (role === 'faculty') {
        result = await Faculty.findOne({ id: userId }).populate('user');
    };

    return result;
};

const changeStatusIntoDB = async (id: string, payload: { status: string }) => {
    const result = await User.findByIdAndUpdate(id, payload, { new: true });
    return result;
}


export const UserService = {
    createUserIntoDb,
    createFacultyIntoDB,
    createAdminIntoDb,
    getMeFromDB,
    changeStatusIntoDB,
}
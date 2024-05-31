import mongoose from "mongoose";
import { StudentModel } from "../student.model";
import { Student } from "./student.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { User } from "../user/user.model";

// const createStudentIntoDB  = async (student: Student) =>{
   
//     // const result = await StudentModel.create(student);   //built-in mongoose static method
//     //using custom static method
//     // if(await StudentModel.isUserExists(student.id)){
//     //     throw new Error('User Already exists!!')
//     // }
   
//     //using mongoose built-in instance method now
    
//     const studentInstance = new StudentModel(student); //created instance
//     // custom instance method
//     if(await studentInstance.isUserExists(student.id)){
//         throw new Error ('User already exists!!');
//     };

//     const result = await studentInstance.save()  //creating instance

//     return result;
// } 
const getAllStudentsFromDB = async () =>{
    const result = await StudentModel.find().populate('admissionSemester').populate({
        path:'academicDepartment',
        populate:{
            path:'academicFaculty',
        },
    });
    return result;
}

const getSingleStudentFromDB = async (id : string) =>{
    // const result = await StudentModel.findOne({id});
    const result = await StudentModel.findOne({id}).populate('admissionSemester').populate({
        path:'academicDepartment',
        populate:{
            path:'academicFaculty',
        },
    });
    return result;
};

const updateSingleStudentIntoDB = async(id:string, payload:Partial<Student>)=>{
    const { name, guardian, localGuardian, ...remainingStudentData } = payload;

    const modifiedUpdatedData: Record<string, unknown> ={
        ...remainingStudentData,
    };

    if(name && Object.keys(name).length){
        for(const [key, value] of Object.entries(name)){
            modifiedUpdatedData[`name.${key}`] = value;
    }
    }
    if(guardian && Object.keys(guardian).length){
        for(const [key, value] of Object.entries(guardian)){
            modifiedUpdatedData[`guardian.${key}`] = value;
    }
    }
    if(localGuardian && Object.keys(localGuardian).length){
        for(const [key, value] of Object.entries(localGuardian)){
            modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
    }

    // const {  }
    const result = await StudentModel.findOneAndUpdate({id}, modifiedUpdatedData, {new:true});
    return result;
    };

const deleteStudentFromDB = async ( id : string ) =>{

    const session = await mongoose.startSession()
    try {

        session.startTransaction()

        const deletedStudent = await StudentModel.findOneAndUpdate({ id }, { isDeleted : true }, {new:true, session});
        if(!deletedStudent){
            throw new AppError(httpStatus.BAD_REQUEST,'Failed to delete student')
        }

        const deletedUser = await User.findOneAndUpdate({id}, {isDeleted:true}, {new:true, session});
        if(!deletedUser){
            throw new AppError(httpStatus.BAD_REQUEST,'Failed to delete a user')
        }

        await session.commitTransaction();
        await session.endSession();

        return deletedStudent;
    } catch (error) {
        // console.log(error)
        await session.abortTransaction();
        await session.endSession();
        throw new Error('Failed to delete student for transaction error')
    }

}

export const studentServices ={
    // createStudentIntoDB,
    getAllStudentsFromDB,
    getSingleStudentFromDB,
    deleteStudentFromDB,
}
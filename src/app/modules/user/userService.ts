
import config from "../../config";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { StudentModel } from "../student.model";
import { Student } from "../student/student.interface";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { generateStudentId } from "./user.utils";

const createUserIntoDb = async(password:string ,payload:Student)=>{
    //create a user object
    const userData: Partial<TUser> ={};


    //if password is not given
   userData.password = password || (config.default_password as string);

    //set student role
    userData.role = 'student';

    //find academic semester info
     const admissionSemester = await AcademicSemester.findById(payload.admissionSemester);

     if (!admissionSemester) {
        throw new Error('Admission semester not found');
      }

    //generate id
    userData.id =     await generateStudentId(admissionSemester);

    //create a user
    const newUser = await User.create(userData);


    //create a student
    if(Object.keys(newUser).length){
        //set id , _id as user
        payload.id = newUser.id;
        payload.user = newUser._id;  // reference

        const newStudent = await StudentModel.create(payload);
        return newStudent;
    }


    
};

export const UserService = {
    createUserIntoDb,
}
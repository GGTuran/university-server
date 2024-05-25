
import config from "../../config";
import { StudentModel } from "../student.model";
import { Student } from "../student/student.interface";
import { TUser } from "./user.interface";
import { User } from "./user.model";

const createUserIntoDb = async(password:string ,studentData:Student)=>{
    //create a user object
    const userData: Partial<TUser> ={};


    //if password is not given
   userData.password = password || (config.default_password as string);

    //set student role
    userData.role = 'student';

    //manual id
    userData.id = '2030100001'

    //create a user
    const newUser = await User.create(userData);


    //create a student
    if(Object.keys(newUser).length){
        //set id , _id as user
        studentData.id = newUser.id;
        studentData.user = newUser._id;  // reference

        const newStudent = await StudentModel.create(studentData);
        return newStudent;
    }


    
};

export const UserService = {
    createUserIntoDb,
}
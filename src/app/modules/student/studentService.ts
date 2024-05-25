import { StudentModel } from "../student.model";
import { Student } from "./student.interface";

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
    const result = await StudentModel.find();
    return result;
}

const getSingleStudentFromDB = async (id : string) =>{
    // const result = await StudentModel.findOne({id});
    const result = await StudentModel.aggregate([{$match : { id: id }}]);
    return result;
};

const deleteStudentFromDB = async ( id : string ) =>{
    const result = await StudentModel.updateOne({ id }, { isDeleted : true });
    return result;
}

export const studentServices ={
    // createStudentIntoDB,
    getAllStudentsFromDB,
    getSingleStudentFromDB,
    deleteStudentFromDB,
}
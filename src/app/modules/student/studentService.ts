import mongoose from "mongoose";
import { Student } from "../student.model";
import { TStudent } from "./student.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { User } from "../user/user.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { studentSearchableFields } from "./studentConstants";

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


const getAllStudentsFromDB = async (query: Record<string, unknown>) => {

    // const queryObject = {...query};  //copy query

    // const studentSearchableFields = ['email', 'name.firstName', 'presentAddress'];
    // let searchTerm = '';
    // // if searchTerm is  given
    // if(query?.searchTerm){
    //     searchTerm = query?.searchTerm as string;
    // }

    //raw searching
    //dynamically doing it by using map
    // const 

    // const result = await StudentModel.find({
    //     $or:['email', 'name.firstName', 'presentAddress'].map((field)=>
    //         ({
    //             [field]:{$regex:searchTerm, $options:'i'},
    //         })
    // )
    // }).populate('admissionSemester').populate({
    //     path:'academicDepartment',
    //     populate:{
    //         path:'academicFaculty',
    //     },
    // });
    //



    // const searchQuery =  StudentModel.find({                                                                
    //     $or:studentSearchableFields.map((field)=>
    //         ({
    //             [field]:{$regex:searchTerm, $options:'i'},
    //         })
    // )
    // })

    // const excludeFields = ['searchTerm','sort','limit','page','fields'];

    // excludeFields.forEach(elem => delete queryObject[elem]);

    //field filtering
    //     const result = await searchQuery.find(queryObject).populate('admissionSemester').populate({
    //         path:'academicDepartment',
    //         populate:{
    //             path:'academicFaculty',
    //         },
    //     });
    //     return result;
    // }

    // const filterQuery =  searchQuery.find(queryObject).populate('admissionSemester').populate({
    //     path:'academicDepartment',
    //     populate:{
    //         path:'academicFaculty',
    //     },
    // });

    //sorting
    // let sort = '-createdAt';

    // if(query.sort){
    //     sort = query.sort as string;
    // }
    // const sortQuery =  filterQuery.sort(sort);

    //limiting
    //pagination functionality
    // let page = 1;
    // let limit = 1;
    // let skip = 0;

    // //if limit is given 
    // if(query.limit){
    //     limit = Number(query.limit);
    // }
    // //if page is given
    // if(query.page){
    //     page = Number(query.page);
    //     skip = (page - 1) * limit;
    // }

    // const paginateQuery = sortQuery.skip(skip);

    // const limitQuery =  paginateQuery.limit(limit);

    // //field limiting
    // let fields = '-__v';

    // if(query.fields){
    //     fields = (query.fields as string).split(',').join(' ');
    // }

    // const fieldQuery = await limitQuery.select(fields);


    // return fieldQuery;



    const studentQuery = new QueryBuilder(
        Student.find()
            .populate('admissionSemester').populate({
                path: 'academicDepartment',
                populate: {
                    path: 'academicFaculty',
                },
            }),
        query
    )
        .search(studentSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await studentQuery.modelQuery;
    return result;


};

const getSingleStudentFromDB = async (id: string) => {
    // const result = await StudentModel.findOne({id});
    const result = await Student.findOne({ id }).populate('admissionSemester').populate({
        path: 'academicDepartment',
        populate: {
            path: 'academicFaculty',
        },
    });
    return result;
};

const updateSingleStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
    const { name, guardian, localGuardian, ...remainingStudentData } = payload;

    const modifiedUpdatedData: Record<string, unknown> = {
        ...remainingStudentData,
    };

    if (name && Object.keys(name).length) {
        for (const [key, value] of Object.entries(name)) {
            modifiedUpdatedData[`name.${key}`] = value;
        }
    }
    if (guardian && Object.keys(guardian).length) {
        for (const [key, value] of Object.entries(guardian)) {
            modifiedUpdatedData[`guardian.${key}`] = value;
        }
    }
    if (localGuardian && Object.keys(localGuardian).length) {
        for (const [key, value] of Object.entries(localGuardian)) {
            modifiedUpdatedData[`localGuardian.${key}`] = value;
        }
    }

    // const {  }
    const result = await Student.findOneAndUpdate({ id }, modifiedUpdatedData, {
        new: true,
        runValidators: true,
    });
    return result;
};

const deleteStudentFromDB = async (id: string) => {

    const session = await mongoose.startSession()
    try {

        session.startTransaction()

        const deletedStudent = await Student.findOneAndUpdate({ id }, { isDeleted: true }, { new: true, session });
        if (!deletedStudent) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student')
        }

        const deletedUser = await User.findOneAndUpdate({ id }, { isDeleted: true }, { new: true, session });
        if (!deletedUser) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete a user')
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

export const studentServices = {
    // createStudentIntoDB,
    getAllStudentsFromDB,
    getSingleStudentFromDB,
    deleteStudentFromDB,
    updateSingleStudentIntoDB,
}
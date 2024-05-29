import { Schema, model } from "mongoose";
import { TAcademicFAculty } from "./academicFaculty.interface";

const academicFacultySchema = new Schema<TAcademicFAculty>(
    {
        name:{
            type:String,
            required:true,
            unique:true,
        },
    },
    {
        timestamps:true,
    },
);

export const AcademicFaculty = model<TAcademicFAculty>('AcademicFaculty',academicFacultySchema);
import { Schema, model, connect, Model, Types } from 'mongoose';

export type UserName = {
    firstName: string;
    middleName?: string;
    lastName: string;
  };
  
  export type Guardian = {
    fatherName: string;
    fatherOccupation: string;
    fatherContactNo: string;
    motherName: string;
    motherOccupation: string;
    motherContactNo: string;
  };
  
  export type LocalGuardian = {
    name: string;
    occupation: string;
    contactNo: string;
    address: string;
  };
  
  export type Student = {
    id: string;
    user:Types.ObjectId;
    password:string;
    name: UserName;
    gender: 'male' | 'female';
    dateOfBirth?: string;
    email: string;
    contactNo: string;
    emergencyContactNo: string;
    bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
    presentAddress: string;
    permanentAddress: string;
    guardian: Guardian;
    localGuardian: LocalGuardian;
    profileImg?: string;
    // isActive: 'active' | 'blocked';
    isDeleted:boolean;
  };

  //Custom static method
  // export interface StudentMethodsStatic extends Model<Student>{
  //   isUserExists(id:string) : Promise<Student | null>;
  // } 









  // custom instance method
  
  export type StudentMethodsInstance = {
    isUserExists(id : string):Promise<Student | null>;
  };

  export type StudentInstanceModel = Model<
  Student,
  Record<string, never>,
  StudentMethodsInstance
  >;
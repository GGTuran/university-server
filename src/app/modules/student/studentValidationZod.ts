import { z } from "zod";

// UserName Zod schema
const userNameZodSchema = z.object({
    firstName: z.string().trim()
        .max(20, "First name can't be more than 20 characters"),
    middleName: z.string()
        .trim()
        .optional(),
    lastName: z.string()
        .trim()
        .min(1)
});

// Guardian Zod schema
const guardianZodSchema = z.object({
    fatherName: z.string()
        .max(20, "Father name can't be more than 20 characters")
        .trim()
    ,
    fatherOccupation: z.string()
    ,
    fatherContactNo: z.string()
    ,
    motherName: z.string()
        .trim()
    ,
    motherOccupation: z.string()
    ,
    motherContactNo: z.string()
    ,
});

// LocalGuardian Zod schema
const localGuardianZodSchema = z.object({
    name: z.string()
    ,
    occupation: z.string()
    ,
    contactNo: z.string()
    ,
    address: z.string()
    ,
});

// Student Zod schema
const studentZodSchema = z.object({
    id: z.string(),
    password:z.string(),
    name: userNameZodSchema,
    gender: z.enum(['male', 'female'], {
        errorMap: () => ({ message: '{VALUE} is not valid' }),
    }),
    dateOfBirth: z.string().optional(),
    email: z.string()
        .email('Email is not a valid email address')
    ,
    contactNo: z.string()
    ,
    emergencyContactNo: z.string()
    ,
    bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
        errorMap: () => ({ message: '{VALUE} is not valid' }),
    }).optional(),
    presentAddress: z.string()
    ,
    permanentAddress: z.string()
    ,
    guardian: guardianZodSchema
    ,
    localGuardian: localGuardianZodSchema
    ,
    profileImg: z.string().optional(),
    isActive: z.enum(['active', 'blocked'], {
        errorMap: () => ({ message: '{VALUE} is not valid' }),
    }).default('active'),
});


export default studentZodSchema;
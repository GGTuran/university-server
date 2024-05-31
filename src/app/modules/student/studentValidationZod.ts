import { z } from "zod";

// UserName Zod schema
const createUserNameZodSchema = z.object({
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
const createGuardianZodSchema = z.object({
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
const createLocalGuardianZodSchema = z.object({
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
export const createStudentZodSchema = z.object({
    body: z.object({
        password: z.string(),
        student: z.object({
            name: createUserNameZodSchema,
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
            guardian: createGuardianZodSchema
            ,
            localGuardian: createLocalGuardianZodSchema
            ,
            profileImg: z.string().optional(),
            admissionSemester: z.string(),
            academicDepartment:z.string(),
        }),
    }),

});


//validation for updating 
const updateUserNameZodSchema = z.object({
    firstName: z.string().trim()
        .max(20, "First name can't be more than 20 characters").optional(),
    middleName: z.string()
        .trim()
        .optional(),
    lastName: z.string()
        .trim()
        .min(1).optional()
});

// Guardian Zod schema
const updateGuardianZodSchema = z.object({
    fatherName: z.string()
        .max(20, "Father name can't be more than 20 characters")
        .trim().optional()
    ,
    fatherOccupation: z.string().optional()
    ,
    fatherContactNo: z.string().optional()
    ,
    motherName: z.string()
        .trim().optional()
    ,
    motherOccupation: z.string().optional()
    ,
    motherContactNo: z.string().optional()
    ,
});

// LocalGuardian Zod schema
const updateLocalGuardianZodSchema = z.object({
    name: z.string().optional()
    ,
    occupation: z.string().optional()
    ,
    contactNo: z.string().optional()
    ,
    address: z.string().optional()
    ,
});

// Student Zod schema
export const updateStudentZodSchema = z.object({
    body: z.object({
        // password: z.string().optional(),
        student: z.object({
            name: updateUserNameZodSchema.optional(),
            gender: z.enum(['male', 'female'], {
                errorMap: () => ({ message: '{VALUE} is not valid' }),
            }).optional(),
            dateOfBirth: z.string().optional(),
            email: z.string()
                .email('Email is not a valid email address').optional()
            ,
            contactNo: z.string().optional()
            ,
            emergencyContactNo: z.string().optional()
            ,
            bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
                errorMap: () => ({ message: '{VALUE} is not valid' }),
            }).optional(),
            presentAddress: z.string().optional()
            ,
            permanentAddress: z.string().optional()
            ,
            guardian: updateGuardianZodSchema.optional()
            ,
            localGuardian: updateLocalGuardianZodSchema.optional()
            ,
            profileImg: z.string().optional(),
            admissionSemester: z.string().optional(),
            academicDepartment:z.string().optional(),
        }),
    }),

});

// export const studentZod = {
//      createStudentZodSchema
// };
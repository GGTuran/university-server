import Joi from "joi";

//creating a schema using joi validation

  const userNameJoiSchema = Joi.object({
    firstName: Joi.string()
        .max(20)
        .trim()
        .required()
        .messages({
            'string.max': "First name can't be more than 20 characters",
            'string.pattern.name': '{#label} is not in capitalize form',
            'any.required': 'First Name is required'
        }),
    middleName: Joi.string()
        .trim()
        .optional(),
    lastName: Joi.string()
        .trim()
        .required()
        .messages({
            'any.required': 'Last Name is required'
        })
});

// Guardian Joi schema
const guardianJoiSchema = Joi.object({
    fatherName: Joi.string()
        .max(20)
        .trim()
        .required()
        .messages({
            'string.max': "Father name can't be more than 20 characters",
            'any.required': 'Father name should be given'
        }),
    fatherOccupation: Joi.string()
        .required()
        .messages({
            'any.required': 'Occupation should be given'
        }),
    fatherContactNo: Joi.string()
        .required()
        .messages({
            'any.required': 'Contact number should be given'
        }),
    motherName: Joi.string()
        .trim()
        .required()
        .messages({
            'any.required': "Mother's name should be given"
        }),
    motherOccupation: Joi.string()
        .required()
        .messages({
            'any.required': 'Occupation should be given'
        }),
    motherContactNo: Joi.string()
        .required()
        .messages({
            'any.required': 'Contact number should be included'
        })
});

// LocalGuardian Joi schema
const localGuardianJoiSchema = Joi.object({
    name: Joi.string()
        .required()
        .messages({
            'any.required': 'Name is required'
        }),
    occupation: Joi.string()
        .required()
        .messages({
            'any.required': 'Occupation is required'
        }),
    contactNo: Joi.string()
        .required()
        .messages({
            'any.required': 'Contact number should be given'
        }),
    address: Joi.string()
        .required()
        .messages({
            'any.required': 'Address should be included'
        })
});

// Student Joi schema
const studentJoiSchema = Joi.object({
    id: Joi.string()
        .required()
        .messages({
            'any.required': 'ID is required'
        }),
    name: userNameJoiSchema.required()
        .messages({
            'any.required': 'User name must be given'
        }),
    gender: Joi.string()
        .valid('male', 'female')
        .required()
        .messages({
            'any.only': '{#label} is not valid',
            'any.required': 'Should let us know the gender'
        }),
    dateOfBirth: Joi.string()
        .optional(),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': '{#label} is not a valid email address',
            'any.required': 'Email is required'
        }),
    contactNo: Joi.string()
        .required()
        .messages({
            'any.required': 'Contact number is invalid'
        }),
    emergencyContactNo: Joi.string()
        .required()
        .messages({
            'any.required': 'This number is invalid'
        }),
    bloodGroup: Joi.string()
        .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
        .messages({
            'any.only': '{#label} is not valid'
        }),
    presentAddress: Joi.string()
        .required()
        .messages({
            'any.required': 'Present address is required'
        }),
    permanentAddress: Joi.string()
        .required()
        .messages({
            'any.required': 'Permanent address is required'
        }),
    guardian: guardianJoiSchema.required()
        .messages({
            'any.required': "Guardian's data should be given"
        }),
    localGuardian: localGuardianJoiSchema.required()
        .messages({
            'any.required': "Local guardian's data should be given"
        }),
    profileImg: Joi.string()
        .optional(),
    isActive: Joi.string()
        .valid('active', 'blocked')
        .default('active')
        .messages({
            'any.only': '{#label} is not valid'
        })
});

export default studentJoiSchema;

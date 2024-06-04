import express from 'express';
import { userController } from './user.controller';
import validate from '../../middlewares/validate';
import { createStudentZodSchema } from '../student/studentValidationZod';
import { createFacultyValidationSchema } from '../faculty/faculty.validation';

const router = express.Router();

router.post(
    '/create-student',
    validate(createStudentZodSchema),
    userController.createStudent);

router.post(
    '/create-faculty',
    validate(createFacultyValidationSchema),
    userController.createFaculty
);    

export const UserRoutes = router; 
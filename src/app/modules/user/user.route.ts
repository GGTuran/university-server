import express from 'express';
import { userController } from './user.controller';
import validate from '../../middlewares/validate';
import { createStudentZodSchema } from '../student/studentValidationZod';
import { createFacultyValidationSchema } from '../faculty/faculty.validation';
import { createAdminValidationSchema } from '../admin/admin.validation';

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

router.post(
    '/create-admin',
    validate(createAdminValidationSchema),
    userController.createAdmin
)

export const UserRoutes = router; 
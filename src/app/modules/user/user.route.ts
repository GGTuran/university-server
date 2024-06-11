import express from 'express';
import { userController } from './user.controller';
import validate from '../../middlewares/validate';
import { createStudentZodSchema } from '../student/studentValidationZod';
import { createFacultyValidationSchema } from '../faculty/faculty.validation';
import { createAdminValidationSchema } from '../admin/admin.validation';
import { USER_ROLE } from './user.constatant';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
    '/create-student',
    auth(USER_ROLE.admin),
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
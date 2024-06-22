import express from 'express';
import { studentControllers } from './student.controller';
import validate from '../../middlewares/validate';
import { updateStudentZodSchema } from './studentValidationZod';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constatant';

const router = express.Router();

//will call controller function
// router.post('/create-student', studentControllers.createStudent);

router.get(
    '/',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    studentControllers.getAllStudents);

router.get(
    '/:studentId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
    studentControllers.getSingleStudent);

router.patch(
    '/:studentId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validate(updateStudentZodSchema),
    studentControllers.updateStudent);

router.delete(
    '/:studentId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    studentControllers.deleteStudent);

export const studentRoutes = router;
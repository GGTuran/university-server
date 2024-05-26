import express from 'express';
import { userController } from './user.controller';
import validate from '../../middlewares/validate';
import { createStudentZodSchema } from '../student/studentValidationZod';

const router = express.Router();

router.post(
    '/create-student',
    validate(createStudentZodSchema),
    userController.createStudent);

export const UserRoutes = router; 
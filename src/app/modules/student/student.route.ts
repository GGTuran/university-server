import express from 'express';
import { studentControllers } from './student.controller';
import validate from '../../middlewares/validate';
import { updateStudentZodSchema } from './studentValidationZod';
import auth from '../../middlewares/auth';

const router = express.Router();

//will call controller function
// router.post('/create-student', studentControllers.createStudent);

router.get('/', studentControllers.getAllStudents);

router.get(
    '/:studentId',
    auth('admin', 'faculty', 'student'),
     studentControllers.getSingleStudent);

router.patch('/:studentId',
validate(updateStudentZodSchema),
 studentControllers.updateStudent);

router.delete('/:studentId', studentControllers.deleteStudent);

export const studentRoutes =router;
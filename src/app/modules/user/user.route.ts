import express, { NextFunction, Request, Response } from 'express';
import { userController } from './user.controller';
import validate from '../../middlewares/validate';
import { createStudentZodSchema } from '../student/studentValidationZod';
import { createFacultyValidationSchema } from '../faculty/faculty.validation';
import { createAdminValidationSchema } from '../admin/admin.validation';
import { USER_ROLE } from './user.constatant';
import auth from '../../middlewares/auth';
import { UserZod } from './user.validation';
import { upload } from '../../utils/imageToCloud';

const router = express.Router();

router.post(
    '/create-student',
    auth(USER_ROLE.admin),
    upload.single('file'),
    (req: Request, res:Response, next:NextFunction)=>{
        req.body = JSON.parse(req.body.data);
        next();
    },
    validate(createStudentZodSchema),
    userController.createStudent);

router.post(
    '/create-faculty',
    auth(USER_ROLE.admin),
    upload.single('file'),
    (req: Request, res:Response, next:NextFunction)=>{
        req.body = JSON.parse(req.body.data);
        next();
    },
    validate(createFacultyValidationSchema),
    userController.createFaculty
);

router.post(
    '/create-admin',
    upload.single('file'),
    (req: Request, res:Response, next:NextFunction)=>{
        req.body = JSON.parse(req.body.data);
        next();
    },
    validate(createAdminValidationSchema),
    userController.createAdmin
);

router.get(
    '/me',
    auth('admin', 'faculty', 'student'),
    userController.getMe,
);

router.post(
    '/change-status/:id',
    auth('admin'),
    validate(UserZod.changeStatusValidationSchema),
    userController.changeStatus
)

export const UserRoutes = router; 
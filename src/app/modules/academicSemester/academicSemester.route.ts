import express from 'express';
import validate from '../../middlewares/validate';
import { academicSemesterValidation } from './academicSemester.validation';
import { AcademicSemesterControllers } from './academicSemester.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constatant';

const router = express.Router();

router.post(
    '/create-semester',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validate(academicSemesterValidation.academicSemesterZOdSchema),
    AcademicSemesterControllers.createAcademicSemester
);

router.get(
    '/',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    AcademicSemesterControllers.getAllAcademicSemester);

router.get(
    '/:semesterId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    AcademicSemesterControllers.getSingleAcademicSemester);

router.patch(
    '/:semesterId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validate(academicSemesterValidation.updateAcademicSemesterZOdSchema),
    AcademicSemesterControllers.updateAcademicSemester);

export const AcademicSemesterRoutes = router;
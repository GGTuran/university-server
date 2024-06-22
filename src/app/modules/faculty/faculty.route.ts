import express from 'express';
import { FacultyControllers } from './faculty.controller';
import validate from '../../middlewares/validate';
import { updateFacultyValidationSchema } from './faculty.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constatant';

const router = express.Router();

router.get(
    '/',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
    FacultyControllers.getAllFaculty);

router.get(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
    FacultyControllers.getSingleFaculty);

router.patch(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validate(updateFacultyValidationSchema),
    FacultyControllers.updateFaculty
);

router.delete(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    FacultyControllers.deleteFaculty);

export const FacultyRoutes = router;
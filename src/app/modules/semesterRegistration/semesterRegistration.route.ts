import express from 'express';
import validate from '../../middlewares/validate';
import { semesterRegistrationValidations } from './semesterRegistration.validation';
import { SemesterRegistrationControllers } from './semesterRegistration.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constatant';

const router = express.Router();

router.post(
    '/create-semester-registration',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validate(semesterRegistrationValidations.createSemesterRegistrationValidation),
    SemesterRegistrationControllers.createSemesterRegistration
);

router.get(
    '/',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    SemesterRegistrationControllers.getAllSemesterRegistration);

router.get(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    SemesterRegistrationControllers.getSingleSemesterRegistration);

router.patch(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validate(semesterRegistrationValidations.updateSemesterRegistrationValidation),
    SemesterRegistrationControllers.updateSemesterRegistration
);

router.delete(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    SemesterRegistrationControllers.deleteSemesterRegistration
)

export const SemesterRegistrationRoutes = router;
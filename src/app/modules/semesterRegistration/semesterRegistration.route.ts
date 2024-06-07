import express from 'express';
import validate from '../../middlewares/validate';
import { semesterRegistrationValidations } from './semesterRegistration.validation';
import { SemesterRegistrationControllers } from './semesterRegistration.controller';

const router = express.Router();

router.post(
    '/create-semester-registration',
    validate(semesterRegistrationValidations.createSemesterRegistrationValidation),
    SemesterRegistrationControllers.createSemesterRegistration
);

router.get('/', SemesterRegistrationControllers.getAllSemesterRegistration);

router.get('/:id', SemesterRegistrationControllers.getSingleSemesterRegistration);

router.patch(
    '/:id',
    validate(semesterRegistrationValidations.updateSemesterRegistrationValidation),
    SemesterRegistrationControllers.updateSemesterRegistration
);

export const SemesterRegistrationRoutes = router;
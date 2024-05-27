import express from 'express';
import validate from '../../middlewares/validate';
import { academicSemesterValidation } from './academicSemester.validation';
import { AcademicSemesterControllers } from './academicSemester.controller';

const router = express.Router();

router.post(
    '/create-semester',
    validate(academicSemesterValidation.academicSemesterZOdSchema),
    AcademicSemesterControllers.createAcademicSemester
);

router.get('/',AcademicSemesterControllers.getAllAcademicSemester);

router.get('/:semesterId',AcademicSemesterControllers.getSingleAcademicSemester);

router.patch('/:semesterId', AcademicSemesterControllers.updateAcademicSemester);

export const AcademicSemesterRoutes = router;
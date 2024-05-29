import express from 'express';
import validate from '../../middlewares/validate';
import { academicFacultyValidation } from './academicFaculty.validation';
import { AcademicFacultyControllers } from './academicFaculty.controller';
import { AcademicSemesterControllers } from '../academicSemester/academicSemester.controller';

const router = express.Router();

router.post('/create',
    validate(academicFacultyValidation.createAcademicFacultyZod),
    AcademicFacultyControllers.createAcademicFaculty
);

router.get('/', AcademicFacultyControllers.getAllAcademicFaculty);

router.get('/:facultyId', AcademicFacultyControllers.getSingleAcademicFaculty);

router.patch('/:facultyId',
    validate(academicFacultyValidation.updateAcademicFacultyZod),
    AcademicSemesterControllers.updateAcademicSemester
);

export const AcademicFacultyRoutes = router;
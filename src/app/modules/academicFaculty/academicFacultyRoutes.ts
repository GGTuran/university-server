import express from 'express';
import validate from '../../middlewares/validate';
import { academicFacultyValidation } from './academicFaculty.validation';
import { AcademicFacultyControllers } from './academicFaculty.controller';


const router = express.Router();

router.post('/create',
    validate(academicFacultyValidation.createAcademicFacultyZod),
    AcademicFacultyControllers.createAcademicFaculty
);

router.get('/', AcademicFacultyControllers.getAllAcademicFaculty);

router.get('/:facultyId', AcademicFacultyControllers.getSingleAcademicFaculty);

router.patch('/:facultyId',
    validate(academicFacultyValidation.updateAcademicFacultyZod),
    AcademicFacultyControllers.updateAcademicFaculty
);

export const AcademicFacultyRoutes = router;
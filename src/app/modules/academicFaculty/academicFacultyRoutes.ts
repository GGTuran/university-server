import express from 'express';
import validate from '../../middlewares/validate';
import { academicFacultyValidation } from './academicFaculty.validation';
import { AcademicFacultyControllers } from './academicFaculty.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constatant';


const router = express.Router();

router.post('/create/academic-faculty',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
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
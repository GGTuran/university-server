import express from 'express';
import validate from '../../middlewares/validate';
import { AcademicDepartmentValidation } from './academicDepartment.validation';
import { AcademicDepartmentController } from './academicDepartment.controller';

const router = express.Router();

router.post('/create',
    validate(AcademicDepartmentValidation.createAcademicDepartmentZod),
    AcademicDepartmentController.createAcademicDepartment
);

router.get('/',AcademicDepartmentController.getAllAcademicDepartment);

router.get('/:departmentId',AcademicDepartmentController.getSingleDepartment);

router.patch('/:departmentId',
    validate(AcademicDepartmentValidation.updateAcademicDepartmentZod),
    AcademicDepartmentController.updateAcademicDepartment
);

export const AcademicDepartmentRoutes = router;
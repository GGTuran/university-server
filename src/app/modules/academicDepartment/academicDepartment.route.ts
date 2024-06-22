import express from 'express';
import validate from '../../middlewares/validate';
import { AcademicDepartmentValidation } from './academicDepartment.validation';
import { AcademicDepartmentController } from './academicDepartment.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constatant';

const router = express.Router();

router.post('/create',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
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
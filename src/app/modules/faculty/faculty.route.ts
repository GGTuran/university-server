import express from 'express';
import { FacultyControllers } from './faculty.controller';
import validate from '../../middlewares/validate';
import { updateFacultyValidationSchema } from './faculty.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get('/', auth('admin','faculty','student'), FacultyControllers.getAllFaculty);

router.get('/:id', FacultyControllers.getSingleFaculty);

router.patch(
    '/:id',
    validate(updateFacultyValidationSchema),
    FacultyControllers.updateFaculty
);

router.delete('/:id', FacultyControllers.deleteFaculty);

export const FacultyRoutes = router;
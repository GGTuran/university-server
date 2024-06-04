import express from 'express';
import { FacultyControllers } from './faculty.controller';
import validate from '../../middlewares/validate';
import { updateFacultyValidationSchema } from './faculty.validation';

const router = express.Router();

router.get('/', FacultyControllers.getAllFaculty);

router.get('/:id', FacultyControllers.getSingleFaculty);

router.patch(
    '/:id',
    validate(updateFacultyValidationSchema),
    FacultyControllers.updateFaculty
);

router.delete('/:id', FacultyControllers.deleteFaculty);

export const FacultyRoutes = router;
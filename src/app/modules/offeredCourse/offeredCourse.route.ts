import express from 'express';
import validate from '../../middlewares/validate';
import { OfferedCourseControllers } from './offeredCourse.controller';
import { OfferedCourseValidations } from './offeredCourse.validation';

const router = express.Router();

router.post(
    '/create-offered-course',
    validate(OfferedCourseValidations.createOfferedCourseValidationSchema),
    OfferedCourseControllers.createOfferedCourse
);

router.get('/',OfferedCourseControllers.getAllOfferedCourse);

router.get('/:id', OfferedCourseControllers.getSingleOfferedCourse);

router.patch(
    '/:id',
    validate(OfferedCourseValidations.updateOfferedCourseValidationSchema),
    OfferedCourseControllers.updateOfferedCourse,
);

router.delete('/:id',OfferedCourseControllers.deleteOfferedCourse);

export const OfferedCourseRoutes = router;
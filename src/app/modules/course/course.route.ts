import express from 'express';
import validate from '../../middlewares/validate';
import { courseValidations } from './course.validation';
import { CourseControllers } from './courseController';

const router = express.Router();

router.post(
    '/create-course',
    validate(courseValidations.createCourseValidationSchema),
    CourseControllers.createCourse
);

router.get('/', CourseControllers.getAllCourse);

router.get('/:id', CourseControllers.getSingleCourse);

router.delete('/:id', CourseControllers.deleteCourse);

export const CourseRoutes = router;
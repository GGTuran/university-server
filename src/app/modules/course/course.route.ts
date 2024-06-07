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

router.patch(
    '/:id',
    validate(courseValidations.updateCourseValidationSchema),
    CourseControllers.updateCourse
);

router.put(
    '/:courseId/assign-faculties',
    validate(courseValidations.facultiesWithCourseValidationSchema),
    CourseControllers.assignFacultiesWithCourse
);

router.delete(
    '/:courseId/remove-faculties',
    validate(courseValidations.facultiesWithCourseValidationSchema),
    CourseControllers.removeFacultiesFromCourse
)

router.delete('/:id', CourseControllers.deleteCourse);

export const CourseRoutes = router;
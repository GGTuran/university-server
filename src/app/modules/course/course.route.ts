import express from 'express';
import validate from '../../middlewares/validate';
import { courseValidations } from './course.validation';
import { CourseControllers } from './courseController';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constatant';

const router = express.Router();

router.post(
    '/create-course',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validate(courseValidations.createCourseValidationSchema),
    CourseControllers.createCourse
);

router.get(
    '/',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    CourseControllers.getAllCourse);

router.get(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    CourseControllers.getSingleCourse);

router.patch(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validate(courseValidations.updateCourseValidationSchema),
    CourseControllers.updateCourse
);

router.put(
    '/:courseId/assign-faculties',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validate(courseValidations.facultiesWithCourseValidationSchema),
    CourseControllers.assignFacultiesWithCourse
);

router.delete(
    '/:courseId/remove-faculties',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validate(courseValidations.facultiesWithCourseValidationSchema),
    CourseControllers.removeFacultiesFromCourse
);

router.get(
    '/:courseId/get-faculties',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    CourseControllers.getFacultiesFromCourse
)

router.delete(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    CourseControllers.deleteCourse);

export const CourseRoutes = router;
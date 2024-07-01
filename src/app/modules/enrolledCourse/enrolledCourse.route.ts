import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { EnrolledCourseValidations } from './enrolledCourse.validation';
import { EnrolledCourseControllers } from './enrolledCourse.controller';
import { USER_ROLE } from '../user/user.constatant';

const router = express.Router();

router.post(
    '/create-enrolled-course',
    auth(USER_ROLE.student),
    validate(EnrolledCourseValidations.createEnrolledCourseValidationZodSchema),
    EnrolledCourseControllers.createEnrolledCourse,
);

router.get(
    '/my-enrolled-courses',
    auth(USER_ROLE.student),
    EnrolledCourseControllers.getMyEnrolledCourses
)

router.patch(
    '/update-enrolled-course-marks',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
    validate(EnrolledCourseValidations.updateEnrolledCourseMarksValidationZodSchema),
    EnrolledCourseControllers.updateCourseMarks,
)

export const EnrolledCourseRoutes = router;
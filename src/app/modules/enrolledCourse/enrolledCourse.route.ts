import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { EnrolledCourseValidations } from './enrolledCourse.validation';
import { EnrolledCourseControllers } from './enrolledCourse.controller';

const router = express.Router();

router.post(
    '/create-enrolled-course',
    auth('student'),
    validate(EnrolledCourseValidations.createEnrolledCourseValidationZodSchema),
    EnrolledCourseControllers.createEnrolledCourse,
);

router.patch(
    '/update-enrolled-course-marks',
    auth('faculty'),
    validate(EnrolledCourseValidations.updateEnrolledCourseMarksValidationZodSchema),
    EnrolledCourseControllers.updateCourseMarks,
)

export const EnrolledCourseRoutes = router;
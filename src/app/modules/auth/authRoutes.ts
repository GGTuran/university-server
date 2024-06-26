import express from 'express';
import validate from '../../middlewares/validate';
import { AuthValidation } from './auth.validation';
import { AuthControllers } from './auth.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constatant';

const router = express.Router();

router.post(
    '/login',
    validate(AuthValidation.loginValidationSchema),
    AuthControllers.loginUser,
);
router.post(
    '/change-password',
    auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student, USER_ROLE.superAdmin),
    validate(AuthValidation.changePasswordValidationSchema),
    AuthControllers.changePassword,
);

router.post(
    '/refresh-token',
    validate(AuthValidation.refreshTokenValidationSchema),
    AuthControllers.refreshToken,
);

router.post(
    '/forget-password',
    validate(AuthValidation.forgetPasswordValidationSchema),
    AuthControllers.forgetPassword,
);


router.post(
    '/reset-password',
    validate(AuthValidation.resetPasswordValidationSchema),
    AuthControllers.resetPassword,
);



export const AuthRoutes = router;
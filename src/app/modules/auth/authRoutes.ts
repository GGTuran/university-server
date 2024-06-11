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
    auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
    validate(AuthValidation.changePasswordValidationSchema),
    AuthControllers.changePassword,
);

router.post(
    '/refresh-token',
    validate(AuthValidation.refreshTokenValidationSchema),
    AuthControllers.refreshToken,
  );

export const AuthRoutes = router;
import express from 'express';
import validate from '../../middlewares/validate';
import { AuthValidation } from './auth.validation';
import { AuthControllers } from './auth.controller';

const router = express.Router();

router.post(
    '/login',
    validate(AuthValidation.loginValidationSchema),
    AuthControllers.loginUser,
);

export const AuthRoutes = router;
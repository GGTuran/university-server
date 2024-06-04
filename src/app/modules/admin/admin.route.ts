import express from 'express';
import { AdminControllers } from './admin.controller';
import validate from '../../middlewares/validate';
import { updateAdminValidationSchema } from './admin.validation';

const router = express.Router();

router.get('/', AdminControllers.getAllAdmins);

router.get('/:id', AdminControllers.getSingleAdmin);

router.patch(
    '/:id',
    validate(updateAdminValidationSchema),
    AdminControllers.updateAdmin
);

router.delete('/:id', AdminControllers.deleteAdmin);

export const AdminRoutes = router;
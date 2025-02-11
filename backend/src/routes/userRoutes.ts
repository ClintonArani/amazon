import { Router } from 'express';
import * as userController from '../controllers/userController';
import * as authController from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/activate', authController.activateAccount);
router.post('/reset-password', userController.resetPassword);
router.get('/:id', authMiddleware, userController.getUserById);
router.put('/update', authMiddleware, userController.updateUser);

export default router;

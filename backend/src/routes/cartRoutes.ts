// cartRoutes.ts
import express from 'express';
import { cartController } from '../controllers/cartController';
import { authMiddleware } from '../middleware/authMiddleware';
const router = express.Router();

router.post('/add', authMiddleware, cartController.addToCart);
router.get('/:userId', authMiddleware,cartController.getCart);
router.get('/all/:userId',authMiddleware, cartController.getAllCartItems);
router.post('/remove', authMiddleware, cartController.removeFromCart);
router.put('/update', authMiddleware, cartController.updateCartItemQuantity);

export default router;
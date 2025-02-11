// orderRoutes.ts
import express from 'express';
import { orderController } from '../controllers/orderController';
import { adminMiddleware, authMiddleware } from '../middleware/authMiddleware';
const router = express.Router();

router.post('/create', authMiddleware, orderController.createOrder);
router.get('/:userId', authMiddleware, orderController.getOrders);
router.put('/:orderId',authMiddleware,adminMiddleware, orderController.markOrderAsCompleted);

export default router;
import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';

const controller = new OrderController();
const order_router = Router();

order_router.post('/cancel/:order_id', controller.cancelOrder);
order_router.put('/update-status/:order_id', controller.updateOrderStatus);
order_router.get('/all', controller.getAllOrders);

export default order_router;
import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';

const controller = new OrderController();
const order_router = Router();

order_router.post('/cancel/:order_id', controller.cancelOrder);
order_router.put('/update-status/:order_id', controller.updateOrderStatus);
order_router.get('/all', controller.getAllOrders);
order_router.get('/top-products', controller.getTopSellingProducts);
order_router.get('/recent', controller.getRecentOrders);
order_router.get('/sales-overview', controller.getSalesOverview);

export default order_router;
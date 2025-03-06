import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';

let service = new OrderService();

export class OrderController {
    async cancelOrder(req: Request, res: Response) {
        try {
            let { order_id } = req.params;

            let result = await service.cancelOrder(order_id);

            if (result.error) {
                return res.status(400).json(result);
            }

            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({
                error: "An error occurred while cancelling the order"
            });
        }
    }

    async updateOrderStatus(req: Request, res: Response) {
        try {
            let { order_id } = req.params;
            let { new_status } = req.body;

            let result = await service.updateOrderStatus(order_id, new_status);

            if (result.error) {
                return res.status(400).json(result);
            }

            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({
                error: "An error occurred while updating the order status"
            });
        }
    }

    async getAllOrders(req: Request, res: Response) {
        try {
            let result = await service.getAllOrders();

            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({
                error: "An error occurred while fetching orders"
            });
        }
    }
}
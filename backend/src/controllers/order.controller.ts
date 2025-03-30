import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { SalesOverviewResponse } from '../interfaces/sales-overview.interface';

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
            console.error("Error fetching orders:", error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return res.status(500).json({
                error: "An error occurred while fetching orders",
                details: errorMessage
            });
        }
    }

    // order.controller.ts
    async getTopSellingProducts(req: Request, res: Response) {
        try {
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await service.getTopSellingProducts(limit);
            
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({
                error: "An error occurred while fetching top selling products",
                details: (error as Error).message
            });
        }
    }

    // order.controller.ts
    async getRecentOrders(req: Request, res: Response) {
        try {
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await service.getRecentOrders(limit);
            
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({
                error: "An error occurred while fetching recent orders",
                details: (error as Error).message
            });
        }
    }

    async getSalesOverview(req: Request, res: Response) {
        try {
            const result: SalesOverviewResponse = await service.getSalesOverview();
            
            // You can add additional transformations here if needed
            res.status(200).json(result);
            
        } catch (error) {
            console.error('[SalesOverview Error]', error);
            
            res.status(500).json({
                success: false,
                error: "Failed to fetch sales overview",
                details: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            });
        }
    }
}
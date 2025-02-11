// orderController.ts
import { Request, Response } from 'express';
import { orderService } from '../services/orderService';

export const orderController = {
  async createOrder(req: Request, res: Response) {
    try {
      const { userId } = req.body;
      const order = await orderService.createOrder(userId);
      res.status(201).json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async getOrders(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const orders = await orderService.getOrders(userId);
      res.status(200).json(orders);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async markOrderAsCompleted(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
    //   const { adminId } = req.body;
      const updatedOrder = await orderService.markOrderAsCompleted(orderId);
      res.status(200).json(updatedOrder);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
};
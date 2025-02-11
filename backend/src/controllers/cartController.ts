import { Request, Response } from 'express';
import { cartService } from '../services/cartService';

export const cartController = {
  async addToCart(req: Request, res: Response) {
    try {
      const { userId, productId, quantity } = req.body;
      const cartItem = await cartService.addToCart(userId, productId, quantity);
      res.status(201).json(cartItem);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async getCart(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const cart = await cartService.getCart(userId);
      res.status(200).json(cart);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
  async getAllCartItems(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({ error: 'Missing userId' });
      }

      const cartItems = await cartService.getAllCartItems(userId);
      res.status(200).json(cartItems);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
  async removeFromCart(req: Request, res: Response) {
    try {
      const { userId, productId } = req.body;
      const result = await cartService.removeFromCart(userId, productId);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async updateCartItemQuantity(req: Request, res: Response) {
    try {
      const { userId, productId, newQuantity } = req.body;
      const updatedCartItem = await cartService.updateCartItemQuantity(userId, productId, newQuantity);
      res.status(200).json(updatedCartItem);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
};
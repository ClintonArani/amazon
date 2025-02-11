import { Request, Response } from 'express';
import { productService } from '../services/productService';

export class ProductController {
    async createProduct(req: Request, res: Response): Promise<void> {
        try {
          console.log('Received file:', req.file);
          if (!req.file) {
            res.status(400).json({ error: 'No image file uploaded' });
          }
    
          // Parse the price to a float
          const productData = {
            ...req.body,
            price: parseFloat(req.body.price),
            stockQuantity: parseInt(req.body.stockQuantity, 10)
          };
    
          // Validate the parsed price
          if (isNaN(productData.price)) {
            res.status(400).json({ error: 'Invalid price value' });
          }
    
          // Validate the parsed stockQuantity
          if (isNaN(productData.stockQuantity)) {
            res.status(400).json({ error: 'Invalid stock quantity value' });
          }
    
          const product = await productService.createProduct(productData, req.file);
          res.status(201).json(product);
        } catch (error) {
          console.error('Create product error:', error);
          res.status(500).json({ error: 'Internal server error' });
        }
      }

  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await productService.getAllProducts();
      res.json({message: 'Products found', products});
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);
      if (product) {
        res.json({message: 'Product found', product});
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (error) {
      console.error('Get product error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
  
      // Parse and validate price and stockQuantity
      const price = parseFloat(req.body.price);
      const stockQuantity = parseInt(req.body.stockQuantity, 10);
  
      if (isNaN(price)) {
        res.status(400).json({ error: 'Invalid price value' });
      }
  
      if (isNaN(stockQuantity)) {
        res.status(400).json({ error: 'Invalid stock quantity value' });
      }
  
      const productData = {
        ...req.body,
        price,
        stockQuantity,
      };
  
      const product = await productService.updateProduct(id, productData, req.file);
      res.json({ message: 'Product updated', product });
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  

  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await productService.deleteProduct(id);
      res.status(204).json({message: 'Product deleted'});
    } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const productController = new ProductController();
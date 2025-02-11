import { PrismaClient, Product, Prisma } from '@prisma/client';
import cloudinary from '../config/cloudinary';

const prisma = new PrismaClient();

export class ProductService {
    async createProduct(data: Omit<Prisma.ProductCreateInput, 'image'>, imageFile?: Express.Multer.File): Promise<Product> {
        let imageUrl = '';
    
        if (imageFile && imageFile.path) {
          const result = await cloudinary.uploader.upload(imageFile.path, {
            folder: 'shopie',
          });
          imageUrl = result.secure_url;
        }
    
        return prisma.product.create({
          data: {
            ...data,
            image: imageUrl,
          },
        });
      }

  async getAllProducts(): Promise<Product[]> {
    return prisma.product.findMany({
      include: { category: true },
    });
  }

  async getProductById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  async updateProduct(id: string, data: Prisma.ProductUpdateInput, imageFile?: Express.Multer.File): Promise<Product> {
    if (imageFile) {
      const result = await cloudinary.uploader.upload(imageFile.path, {
        folder: 'shopie',
      });
      data.image = result.secure_url;
    }

    return prisma.product.update({
      where: { id },
      data,
    });
  }

  async deleteProduct(id: string): Promise<Product> {
    return prisma.product.delete({ where: { id } });
  }
}

export const productService = new ProductService();
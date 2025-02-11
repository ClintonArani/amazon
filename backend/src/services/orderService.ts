import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const orderService = {
  async createOrder(userId: string) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        cartItems: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    const total = cart.cartItems.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );

    const order = await prisma.$transaction(async (prisma) => {
      const newOrder = await prisma.order.create({
        data: {
          userId,
          total,
          items: {
            create: cart.cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
        include: { items: true },
      });

      // Clear the cart
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    return order;
  },

  async getOrders(userId: string) {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    return orders;
  },

  async markOrderAsCompleted(orderId: string) {
    // const admin = await prisma.user.findUnique({
    //   where: { id: adminId },
    // });

    // if (!admin || !admin.isAdmin) {
    //   throw new Error('Unauthorized');
    // }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'completed' },
    });

    return updatedOrder;
  },
};
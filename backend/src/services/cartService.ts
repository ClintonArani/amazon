import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const cartService = {
  async addToCart(userId: string, productId: string, quantity: number) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    if (product.stockQuantity < quantity) {
      throw new Error('Insufficient stock');
    }

    const cart = await prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });

    const cartItem = await prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
      create: {
        cartId: cart.id,
        productId,
        quantity,
      },
      update: {
        quantity: { increment: quantity },
      },
    });

    await prisma.product.update({
      where: { id: productId },
      data: {
        stockQuantity: { decrement: quantity },
      },
    });

    return cartItem;
  },

  async getCart(userId: string) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return cart;
  },
  async getAllCartItems(userId: string) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        cartItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true,
                stockQuantity: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return []; 
    }

    return cart.cartItems.map(item => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      product: item.product,
      totalPrice: item.quantity * item.product.price,
    }));
  },
  async removeFromCart(userId: string, productId: string) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: true },
    });

    if (!cart) {
      throw new Error('Cart not found');
    }

    const cartItem = cart.cartItems.find(item => item.productId === productId);

    if (!cartItem) {
      throw new Error('Item not found in cart');
    }

    await prisma.$transaction([
      prisma.cartItem.delete({
        where: { id: cartItem.id },
      }),
      prisma.product.update({
        where: { id: productId },
        data: {
          stockQuantity: { increment: cartItem.quantity },
        },
      }),
    ]);

    return { message: 'Item removed from cart' };
  },

  async updateCartItemQuantity(userId: string, productId: string, newQuantity: number) {
    if (typeof newQuantity !== 'number' || newQuantity < 0) {
      throw new Error('Invalid quantity. Please provide a non-negative number.');
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: true },
    });

    if (!cart) {
      throw new Error('Cart not found');
    }

    const cartItem = cart.cartItems.find(item => item.productId === productId);

    if (!cartItem) {
      throw new Error('Item not found in cart');
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const quantityDifference = newQuantity - cartItem.quantity;

    if (product.stockQuantity < quantityDifference) {
      throw new Error('Insufficient items in stock');
    }

    const updatedCartItem = await prisma.$transaction([
      prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: newQuantity },
      }),
      prisma.product.update({
        where: { id: productId },
        data: {
          stockQuantity: { decrement: quantityDifference },
        },
      }),
    ]);

    return updatedCartItem[0];
  },
};
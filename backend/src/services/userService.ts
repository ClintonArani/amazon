import prisma from '../prisma/client';
import bcryptjs from 'bcryptjs';

export const getUserById = async (id: string) => {
  if (!id) {
    throw new Error('User ID is required');
  }
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const updateUser = async (id: string, data: any) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id }, 
      data: {
        name: data.name,
        email: data.email,
        password: data.password,

      },
    });

    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error; 
  }
};

export const resetPassword = async (email: string, newPassword: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    return prisma.user.update({
      where: { id: user.id }, 
      data: { password: hashedPassword },
    });
  } catch (error: any) {
    console.error(`Error in resetPassword function: ${error.message}`);

    throw error;
  }
};
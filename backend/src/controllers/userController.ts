import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    const updatedUser = await userService.updateUser(id, { name, email, password });
    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;
    await userService.resetPassword(email, newPassword);
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error: any) {
    if (error.message === 'User not found') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export function updateUserProfile(arg0: string, authMiddleware: (req: import("../middleware/authMiddleware").AuthenticatedRequest, res: Response<any, Record<string, any>>, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>, updateUserProfile: any) {
    throw new Error('Function not implemented.');
}


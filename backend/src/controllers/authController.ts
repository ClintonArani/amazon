// src/controllers/authController.ts
import { Request, Response } from 'express';
import * as authService from '../services/authService';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    await authService.register(email, password, name);
    res.status(201).json({ message: "Registration successful, check your email to activate your account" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    const { token, user } = await authService.login(email, password);
    res.status(200).json({ token, user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const activateAccount = async (req: Request, res: Response ) => {
  try {
    const { email, activationCode } = req.body;
    const user = await authService.activateAccount(email, activationCode);
    res.status(200).json({ message: 'Account activated', user }); 
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

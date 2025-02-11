import { NextFunction, Request, Response } from "express";
import prisma from '../prisma/client';
import bcryptjs from 'bcryptjs';
import sendMail from '../utils/emailService';
import { generateToken, verifyToken } from '../utils/jwtUtils';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { log } from "console";

interface UserCreateInput {
  id: string;
  email: string;
  password: string;
  name?: string;
  activationCode?: string;
  activationExpires?: Date;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const register = async (email: string, password: string, name?: string) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('Email already in use');
  }

  const hashedPassword = await bcryptjs.hash(password, 10);
  const activationCode = generateActivationCode();
  const activationExpires = new Date(Date.now() + 300000); // 5 minutes from now

  const user = await prisma.user.create({
    data: {
      id: uuidv4(),
      email,
      password: hashedPassword,
      name,
      activationCode,
      activationExpires,
    },
  });
  console.log('User:', user);
  
  // console.log('Activation code:', activationCode);

  const templatePath = path.join(__dirname, '../mails/activation-mail.ejs');
  const data = {
    user,
    activationCode,
  };

  await sendMail({
    email: user.email,
    subject: 'Account Activation - Xplora',
    template: templatePath,
    data,
  });

  return user;
};

const generateActivationCode = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const login = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcryptjs.compare(password, user.password))) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken({ userId: user.id, isAdmin: user.isAdmin }, '1d');
  return { token, user };
};

export const activateAccount = async (email: string, activationCode: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('User not found');
  }

  if (user.isActive) {
    throw new Error('Account is already activated');
  }

  if (user.activationCode !== activationCode || 
      !user.activationExpires || 
      new Date() > user.activationExpires) {
    throw new Error('Invalid or expired activation code');
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { 
      isActive: true,
      activationCode: null,
      activationExpires: null,
    },
  });

  return updatedUser;
};

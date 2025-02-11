// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import prisma from '../prisma/client';
import { verifyToken } from '../utils/jwtUtils';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    isAdmin: boolean;
  };
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication token missing or invalid' });
  }

  try {
    const user = verifyToken(token) as { userId: string, isAdmin: boolean };
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export const authorizeRoles = (isAdminRequired: boolean) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.isAdmin !== isAdminRequired) {
      return res.status(403).json({ message: 'Access forbidden: insufficient permissions' });
    }
    next();
  };
};

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication token missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret) as { userId: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) throw new Error('User not found');
    req.user = { userId: user.id, isAdmin: user.isAdmin }; // Assuming user.role is boolean
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const adminMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

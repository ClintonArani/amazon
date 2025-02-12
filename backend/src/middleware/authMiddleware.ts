import { Request, Response, NextFunction } from 'express';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import prisma from '../prisma/client';
import { verifyToken } from '../utils/jwtUtils';

// Extending the Request interface to include 'user'
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    isAdmin: boolean;
  };
}

// JWT Authentication Middleware
export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1]; // 'Authorization' should be recognized correctly now
  if (!token) {
    return res.status(401).json({ message: 'Authentication token missing or invalid' }); // 'status' should work fine here
  }

  try {
    // Cast the decoded token to include userId and isAdmin
    const decoded = verifyToken(token) as JwtPayload & { userId: string; isAdmin: boolean }; // Explicitly adding the types
    req.user = { userId: decoded.userId, isAdmin: decoded.isAdmin };
    next(); // 'next' should work now as it's typed correctly
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Authorization based on user role
export const authorizeRoles = (isAdminRequired: boolean) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.isAdmin !== isAdminRequired) {
      return res.status(403).json({ message: 'Access forbidden: insufficient permissions' });
    }
    next();
  };
};

// Full Authentication Middleware with Prisma check
export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization; // Now 'headers' should be correctly typed

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication token missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Decode token with jwt.verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret) as JwtPayload & { userId: string };
    
    // Fetch user from the database based on decoded userId
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) throw new Error('User not found');
    
    req.user = { userId: user.id, isAdmin: user.isAdmin }; // Attach user data to request
    next(); // 'next' function should now be correctly recognized
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Admin check middleware
export const adminMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};
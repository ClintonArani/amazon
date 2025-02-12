import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in .env file');
}

export const generateToken = (payload: object, expiresIn: string | number = '1h') => {
  // Type cast to ensure expiresIn matches SignOptions
  const options: SignOptions = {
    expiresIn: expiresIn as jwt.SignOptions['expiresIn'], // Explicit cast
  };

  return jwt.sign(payload, JWT_SECRET as string, options);
};

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & { userId: string; isAdmin: boolean };
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
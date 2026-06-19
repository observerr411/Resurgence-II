import { Router, Request, Response } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AppError } from '@middleware/errorHandler';
import { authenticate, AuthRequest, authorize } from '@middleware/auth';

export const authRouter = Router();

// TODO: Replace with actual Prisma models
const users: Map<string, { id: string; email: string; password: string; role: string }> = new Map();

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  organizationName: z.string().min(2, 'Organization name required'),
  organizationType: z.enum(['ngo', 'government', 'private', 'un']),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string(),
});

const generateToken = (userId: string, email: string, role: string) => {
  return jwt.sign(
    { id: userId, email, role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
  );
};

authRouter.post('/signup', async (req: Request, res: Response) => {
  try {
    const data = signupSchema.parse(req.body);

    if (users.has(data.email)) {
      throw new AppError('Email already registered', 400, 'EMAIL_EXISTS');
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const userId = crypto.randomUUID();

    users.set(data.email, {
      id: userId,
      email: data.email,
      password: hashedPassword,
      role: data.organizationType === 'un' ? 'admin' : 'organization_admin',
    });

    const token = generateToken(userId, data.email, data.organizationType);

    res.status(201).json({
      success: true,
      data: {
        userId,
        email: data.email,
        token,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AppError('Validation failed', 400, 'VALIDATION_ERROR', error.errors);
    }
    throw error;
  }
});

authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = users.get(data.email);
    if (!user) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    const token = generateToken(user.id, user.email, user.role);

    res.status(200).json({
      success: true,
      data: {
        userId: user.id,
        email: user.email,
        token,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AppError('Validation failed', 400, 'VALIDATION_ERROR', error.errors);
    }
    throw error;
  }
});

authRouter.get('/me', authenticate, (req: AuthRequest, res: Response) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});

authRouter.post('/logout', authenticate, (req: AuthRequest, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

import { Request, Response, NextFunction } from 'express';
import { logger } from '@utils/logger';
import { ValidationError } from 'class-validator';

export interface ApiError extends Error {
  status?: number;
  code?: string;
  details?: unknown;
}

export class AppError extends Error implements ApiError {
  constructor(
    public message: string,
    public status: number = 500,
    public code: string = 'INTERNAL_ERROR',
    public details?: unknown,
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const error = err as ApiError;
  const status = error.status || 500;
  const code = (error as AppError).code || 'INTERNAL_ERROR';
  const message = error.message || 'Internal Server Error';

  logger.error({
    error: {
      message,
      code,
      status,
      stack: error.stack,
      details: error.details,
    },
    request: {
      method: req.method,
      path: req.path,
      ip: req.ip,
    },
  });

  res.status(status).json({
    success: false,
    error: {
      message,
      code,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
      details: error.details,
    },
    request_id: req.id,
  });
};

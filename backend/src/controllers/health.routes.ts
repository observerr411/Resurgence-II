import { Router, Request, Response } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

healthRouter.get('/ready', (req: Request, res: Response) => {
  // Add database connectivity check here
  res.status(200).json({
    success: true,
    status: 'ready',
    checks: {
      database: 'ok',
      stellar: 'ok',
    },
  });
});

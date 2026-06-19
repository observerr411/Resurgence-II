import express, { Express, Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import dotenv from 'dotenv';

import { logger } from '@utils/logger';
import { errorHandler } from '@middleware/errorHandler';
import { authRouter } from '@controllers/auth.routes';
import { beneficiaryRouter } from '@controllers/beneficiary.routes';
import { fundRouter } from '@controllers/fund.routes';
import { merchantRouter } from '@controllers/merchant.routes';
import { transferRouter } from '@controllers/transfer.routes';
import { supplyChainRouter } from '@controllers/supplychain.routes';
import { healthRouter } from '@controllers/health.routes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Logging Middleware
app.use(pinoHttp({ logger }));

// Body Parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '10kb', extended: true }));

// Health Check
app.use('/health', healthRouter);

// API Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/beneficiaries', beneficiaryRouter);
app.use('/api/v1/funds', fundRouter);
app.use('/api/v1/merchants', merchantRouter);
app.use('/api/v1/transfers', transferRouter);
app.use('/api/v1/supply-chain', supplyChainRouter);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

// Error Handler
app.use(errorHandler);

// Server Startup
const server = app.listen(PORT, () => {
  logger.info(`Resurgence Backend Server running on port ${PORT}`);
  logger.info(`Environment: ${NODE_ENV}`);
  logger.info(`Stellar Network: ${process.env.STELLAR_NETWORK}`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

export default app;

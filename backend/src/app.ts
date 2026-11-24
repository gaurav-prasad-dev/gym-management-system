import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { prisma } from './config/database';
import { globalRateLimiter } from './middleware/rateLimiter';
import { notFound } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';
import { sendSuccess } from './utils/response';
import { authRoutes } from './modules/auth/auth.routes';
import { rolesRouter, permissionsRouter } from './modules/roles/roles.routes';
import { staffRoutes } from './modules/staff/staff.routes';

export const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(globalRateLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health Check Endpoint
app.get('/api/health', async (_req: Request, res: Response) => {
  let dbStatus = 'disconnected';
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch {
    dbStatus = 'error';
  }

  sendSuccess(res, 'Gym Management System API is running', {
    status: 'ok',
    database: dbStatus,
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Authentication Routes
app.use('/api/v1/auth', authRoutes);

// Dynamic RBAC & Permissions Routes
app.use('/api/v1/roles', rolesRouter);
app.use('/api/v1/permissions', permissionsRouter);

// Staff Management Routes
app.use('/api/v1/staff', staffRoutes);

// 404 Handler
app.use(notFound);

// Centralized Error Handler
app.use(errorHandler);

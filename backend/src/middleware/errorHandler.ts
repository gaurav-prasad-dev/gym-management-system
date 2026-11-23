import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { sendError } from '../utils/response';
import { env } from '../config/env';

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    sendError(res, err.message, err.errorCode, err.statusCode, err.details);
    return;
  }

  console.error('[Unhandled Error]:', err);

  const message =
    env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message;

  sendError(res, message, 'INTERNAL_SERVER_ERROR', 500);
};

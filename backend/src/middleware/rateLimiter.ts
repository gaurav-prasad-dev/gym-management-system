import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { sendError } from '../utils/response';

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 minutes
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (_req: Request, res: Response) => {
    sendError(
      res,
      'Too many requests from this IP, please try again after 15 minutes',
      'RATE_LIMIT_EXCEEDED',
      429
    );
  },
});

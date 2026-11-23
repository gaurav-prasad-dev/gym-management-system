import { Request, Response } from 'express';
import { sendError } from '../utils/response';

export const notFound = (req: Request, res: Response): void => {
  sendError(
    res,
    `Cannot find ${req.method} ${req.originalUrl} on this server`,
    'RESOURCE_NOT_FOUND',
    404
  );
};

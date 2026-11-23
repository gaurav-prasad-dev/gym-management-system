import { Response } from 'express';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ErrorDetail {
  field?: string;
  message: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: PaginationMeta;
  error?: {
    code: string;
    details?: ErrorDetail[];
  };
}

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200,
  pagination?: PaginationMeta
): Response => {
  const payload: ApiResponse<T> = {
    success: true,
    message,
  };

  if (data !== undefined) {
    payload.data = data;
  }

  if (pagination) {
    payload.pagination = pagination;
  }

  return res.status(statusCode).json(payload);
};

export const sendError = (
  res: Response,
  message: string,
  errorCode: string = 'INTERNAL_ERROR',
  statusCode: number = 500,
  details?: ErrorDetail[]
): Response => {
  const payload: ApiResponse = {
    success: false,
    message,
    error: {
      code: errorCode,
      ...(details && details.length > 0 ? { details } : {}),
    },
  };

  return res.status(statusCode).json(payload);
};

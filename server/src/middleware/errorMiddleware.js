import { sendError } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';

export const notFound = (req, res, next) => {
  return sendError(res, {
    message: `Resource not found at ${req.originalUrl}`,
    status: 404,
  });
};

export const errorHandler = (err, req, res, next) => {
  logger.error(`Error: ${err.message}`, { stack: process.env.NODE_ENV === 'development' ? err.stack : undefined });

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'An unexpected error occurred. Please try again.';

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `An account or record with this ${field} already exists.`;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid record identifier format.';
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token signature.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token has expired. Please log in again.';
  }

  return sendError(res, {
    message,
    status: statusCode,
    errors: process.env.NODE_ENV === 'development' ? err.errors : null,
  });
};

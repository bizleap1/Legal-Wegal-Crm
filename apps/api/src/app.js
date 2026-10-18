import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { requestIdMiddleware } from './middleware/request-id.js';
import apiV1Routes from './routes/index.js';
import { AppError } from './utils/errors.js';
import { logger } from './utils/logger.js';
export function createApp() {
  const app = express();

  // Basic CORS configuration
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests from frontend or server-to-server (origin undefined)
      callback(null, true);
    },
    credentials: true
  }));
  app.use(cookieParser());

  // Capture raw body for webhook signature verification
  app.use(express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf.toString();
    }
  }));
  app.use(express.urlencoded({
    extended: true
  }));

  // Attach Request ID correlation
  app.use(requestIdMiddleware);

  // Mount API v1
  app.use('/api/v1', apiV1Routes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      status: 'error',
      message: `Route not found: ${req.method} ${req.originalUrl}`
    });
  });

  // Global Error Handler
  app.use((err, req, res, _next) => {
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message = err.message || 'Internal Server Error';
    logger.error(`[${req.id || 'NO_ID'}] ${req.method} ${req.url} - ${message}`, err);
    return res.status(statusCode).json({
      status: 'error',
      message,
      requestId: req.id,
      ...(err.details ? {
        details: err.details
      } : {})
    });
  });
  return app;
}
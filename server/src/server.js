import http from 'http';
import app from './app.js';
import { connectDB } from './config/db.js';
import { logger } from './utils/logger.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const server = http.createServer(app);

    server.listen(PORT, () => {
      logger.info(`====================================================`);
      logger.info(`  ARTHA FINANCE BACKEND API RUNNING ON PORT ${PORT}`);
      logger.info(`  Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`  API Health: http://localhost:${PORT}/api/health`);
      logger.info(`  Created by: Krish Verma`);
      logger.info(`====================================================`);
    });

    // Graceful Shutdown handlers
    const shutdown = (signal) => {
      logger.info(`Received ${signal}. Shutting down server gracefully...`);
      server.close(() => {
        logger.info('HTTP server closed successfully.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err) {
    logger.error('Failed to start Artha Finance server:', err);
    process.exit(1);
  }
};

startServer();

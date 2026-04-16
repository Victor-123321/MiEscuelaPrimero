require('dotenv').config();

const { initializeDatabase } = require('./db/init');
const app = require('./src/app');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await initializeDatabase();

    const server = app.listen(PORT, () => {
      logger.info(`MiEscuelaPrimero API running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
    });

    const gracefulShutdown = (signal) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server:', { message: error.message, stack: error.stack });
    process.exit(1);
  }
}

startServer();

import { createConnection } from 'typeorm';
import { app } from './app.js';
import { GlobalConfig } from './shared/config/globalConfig.js';
import { logger } from './shared/config/logger.js';

let server;

createConnection().then(async connection => {
  logger.info("Database connection established!");
  server = app.listen(GlobalConfig.port, () => {
    logger.info(`Application is running at http://localhost:${GlobalConfig.port}`);
    logger.info(`Open documentation at http://localhost:${GlobalConfig.port}${GlobalConfig.baseName}/api-docs`);
  });
}).catch(error => logger.error(error));


const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit();
    });
  } else {
    process.exit();
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});

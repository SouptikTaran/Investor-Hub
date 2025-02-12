import winston from 'winston';
import path from 'path';

const logger = winston.createLogger({
  level: 'info', 
  transports: [
    new winston.transports.File({ 
      filename: path.join('logs', 'combined.log') // Log all levels to combined.log
    }),
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error' // Log only error level and above to error.log
    })
  ]
});

export default logger;

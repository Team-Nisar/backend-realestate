import winston from 'winston';
import 'winston-mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create a Winston logger instance
export const logger = winston.createLogger({
  level: 'info', // Logging level: 'error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'
  format: winston.format.combine(
    winston.format.timestamp(), // Add timestamp
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    // Console transport for real-time logging
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // Add color to console output
        winston.format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
      ),
    }),
    // MongoDB transport to log directly into the database
    new winston.transports.MongoDB({
      level: 'info', // Minimum logging level to store in MongoDB
      db: process.env.MONGO_URL as string, // MongoDB connection string
      options: {
        useUnifiedTopology: true,
      },
      collection: 'server_logs', // Collection name in MongoDB
      format: winston.format.json(), // Store logs as JSON
    }),
  ],
});

// Export the logger instance

import { Request, Response, NextFunction } from 'express';
import { logger} from '../utils/logger';
import { logEntry } from '../utils/logEntry'; // Import the logger

// Middleware to log requests
export const requestLogger = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id || 'anonymous'; // Assuming the user ID is available in the request, adjust as needed.
  const ip = req.ip || 'unknown';             // Get the IP address of the user
  const api = req.originalUrl || 'unknown';   // Get the API endpoint that was hit

  // Log the request to MongoDB and console
  logger.info(`User ID: ${userId}, IP: ${ip}, API: ${api}`);  // Log to console and MongoDB

  // Save the log to the database (you can call the logEntry function here)
  await logEntry(userId, ip, api);

  next();
};

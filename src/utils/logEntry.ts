import { Log, ILog } from '../models/log.model'; // Adjust path as needed
import { logger } from './logger';

// /**
//  * Logs an entry to the Log collection in MongoDB and the console.
//  * @param userId - The ID of the user making the request (optional).
//  * @param ip - The IP address of the request.
//  * @param api - The API endpoint being accessed.
//  */
export const logEntry = async (userId: string, ip: string, api: string): Promise<void> => {
  try {
    // Create a new log document
    const log: ILog = new Log({
      userId: userId || 'anonymous', // Default to 'anonymous' if no user ID is provided
      ip,
      api,
      timestamp: new Date(),
    });

    // Save the log to the database
    await log.save();

    // Log to the console using Winston
    logger.info(`Logged API access: User ${userId}, IP ${ip}, Endpoint ${api}`);
  } catch (error: any) {
    // Log any errors during the logging process
    logger.error(`Failed to log API access: ${error.message}`);
  }
};

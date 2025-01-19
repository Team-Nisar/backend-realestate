import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cluster from "cluster";
import os from "os";
import { logger } from "./utils/logger"; // Import Winston logger
import { ConnectDB } from "./core/config/db"; // Import your database connection logic
import rateLimit from "express-rate-limit";
import authRoutes from './auth.routes';
import { requestLogger } from "./middleware/logMiddleware";

// Get the number of available CPUs
const numCPUs = os.cpus().length;
const app = express();

// Middleware: Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware: CORS
app.use(cors());

// Load Balancing: Using Clustering
if (cluster.isPrimary) {
  let workers = numCPUs; // Default number of workers is equal to available CPUs
  let workerLoad = 0; // Variable to track worker load

  logger.info(`Primary process running. Forking ${workers} workers...`);

  // Fork the initial number of workers
  for (let i = 0; i < workers; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    logger.warn(`Worker ${worker.process.pid} exited. Code: ${code}, Signal: ${signal}`);
    logger.info("Starting a new worker...");
    cluster.fork();
  });

  // Monitoring server load and adjusting workers dynamically
  setInterval(() => {
    const currentLoad = os.loadavg()[0]; // Load average for the past 1 minute

    // Increase the number of workers if the load exceeds a threshold
    if (currentLoad > 1.5 && workers < numCPUs) {
      workers++;
      logger.info(`Increasing workers to ${workers}`);
      cluster.fork(); // Spawn new worker
    } else if (currentLoad < 0.7 && workers > 1) {
      workers--;
      logger.info(`Decreasing workers to ${workers}`);
      const workerIds = Object.keys(cluster.workers);
      const workerToKill = cluster.workers[workerIds[workerIds.length - 1]];
      workerToKill.kill(); // Kill the last worker
    }
  }, 5000); // Check load every 5 seconds

} else {
  // Connect to Database
  ConnectDB();

  // Middleware: Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
      message: "Too many requests from this IP, please try again after 15 minutes.",
    },
    handler: (req, res, next, options) => {
      logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
      res.status(429).json(options.message);
    },
  });

  // Apply rate limiter to all routes
  app.use(limiter);

  // Routes
  app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to the Real Estate API");
  });
  app.use(requestLogger);

  app.use("/api/v1/users", authRoutes);

  // Middleware: Error Handling
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(`Error occurred: ${err.message}`);
    res.status(500).json({ message: "An internal server error occurred." });
  });

  // Start Server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    logger.info(`Worker ${process.pid} started. Server running on http://localhost:${PORT}`.bgBlue.black);
  });
}

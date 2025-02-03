import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cluster from "cluster";
import os from "os";
import rateLimit from "express-rate-limit";
import { logger } from "./utils/logger"; // Import Winston logger
import { ConnectDB } from "./core/config/db"; // Import your database connection logic
import authRoutes from "./auth.routes"; // Routes for authentication
import path from "path";

const numCPUs = os.cpus().length; // Number of CPU cores
const app = express();

// Middleware: Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware: CORS
app.use(cors());

// Function to dynamically manage workers
const manageWorkers = () => {
  let workers = numCPUs; // Default to the number of CPU cores
  let workerLoad = 0; // Track worker load

  logger.info(`Primary process running. Forking ${workers} workers...`);

  // Fork initial workers
  for (let i = 0; i < workers; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    logger.warn(`Worker ${worker.process.pid} exited. Code: ${code}, Signal: ${signal}`);
    logger.info("Starting a new worker...");
    cluster.fork();
  });

  // Monitor load and adjust worker count dynamically
  setInterval(() => {
    const currentLoad = os.loadavg()[0]; // Get load average over the past 1 minute

    // Increase workers if load is high
    if (currentLoad > 1.5 && workers < numCPUs) {
      workers++;
      logger.info(`Increasing workers to ${workers}`);
      cluster.fork();
    }

    // Decrease workers if load is low
    if (currentLoad < 0.7 && workers > 1) {
      workers--;
      logger.info(`Decreasing workers to ${workers}`);
      const workerIds = Object.keys(cluster.workers || {});
      const workerToKill = cluster.workers![workerIds[workerIds.length - 1]];
      if (workerToKill) workerToKill.kill();
    }
  }, 5000); // Check load every 5 seconds
};

if (cluster.isPrimary) {
  // Run the worker management function
  manageWorkers();
} else {
  // Worker Process Logic

  // Connect to Database
  ConnectDB()
    .then(() => logger.info("Database connected successfully."))
    .catch((err) => {
      logger.error(`Database connection error: ${err.message}`);
      process.exit(1); // Exit worker if DB connection fails
    });

  // Middleware: Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true, // Include rate limit info in standard headers
    legacyHeaders: false, // Disable legacy rate limit headers
    message: {
      message: "Too many requests from this IP. Please try again after 15 minutes.",
    },
    handler: (req, res, next, options) => {
      logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
      res.status(429).json(options.message);
    },
  });

  // Apply rate limiter to all routes
  app.use(limiter);

  app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

  // Root Route
  app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to the Real Estate API");
  });

  // Authentication Routes
  app.use("/api/v1", authRoutes);
  app.use("/upload", ()=>{

  })

  // Middleware: Error Handling
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(`Error occurred: ${err.message}`);
    res.status(500).json({ message: "An internal server error occurred." });
  });

  // Start the Server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    logger.info(`Worker ${process.pid} started. Server running on http://localhost:${PORT}`);
  });
}

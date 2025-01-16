import cluster from 'cluster';
import os from 'os';
import express from 'express';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import dotenv from 'dotenv'
dotenv.config();

const port = process.env.PORT || 5001; // port 
const numCPUs = os.cpus().length; //Number of CPUs cores

// Global Rate Limiter
const globalratelimiter = rateLimit({
   windowMs: 15 * 60 * 1000, // 15 Minutes
   max: 100, // Limit each IP to 100 requests per window
   message: "Too Many requests from this IP, Please try again later."
});


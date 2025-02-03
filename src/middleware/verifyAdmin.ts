import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { Admin } from "../models/admin.model";
import { getActiveResourcesInfo } from "process";

interface JWTPayload extends JwtPayload {
   _id: string;
   role: string;
}

// Middleware to verify token and check if user is admin
export const verifyAdmin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
   try {
      const token = req.headers?.authorization?.split(" ")[1];

      if (!token) {
         return res.status(401).json({ message: "Access Denied. No token provided." });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
      const user = await Admin.findById(decoded._id).lean();

      if (!user) {
         return res.status(401).json({ message: "Unauthorized. User not found." });
      }

      if (user.role !== "admin" || user.role !== 'manager') {
         return res.status(403).json({ message: "Forbidden. Admin access only." });
      }

      req.user = user; // Attach user to request object
      next();
   } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token", error: error.message });
   }
};

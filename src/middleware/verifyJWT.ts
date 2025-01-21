import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { User } from '../models/user.model';

interface JWTPayload{
   _id: string;
   role: string
}

export const verifyToken = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
   try {
      const token = req.headers?.authorization?.split(' ')[1];
      if(!token){
         return res.status(401).json({ message: 'Invalid or expired token' });
      }
      const decode = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload
      const user = await User.findById(decode._id).lean();
      if(!user){
         return res.status(401).json({error: 'Invalid User'})
      }
      req.user = user;
      next();
   } catch (error) {
      return res.status(500).json({error: error.message});
   }
};
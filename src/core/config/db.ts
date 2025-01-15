import mongoose from "mongoose";
import dotenv from 'dotenv';
import 'colors';
dotenv.config();

const mongourl: string = process.env.MONGO_URL;

export const ConnectDB = async () => {
   try {
      const connection = await mongoose.connect(mongourl);
      console.log(`Database Connected on ${connection.connection.host}`.bgGreen.white);
   } catch (error) {
      console.log(`Database not Connected `.bgRed.white);
      process.exit(1);
   }
};
import mongoose from "mongoose";
import dotenv from "dotenv";
import "colors";
dotenv.config();

const mongoUrl: string = process.env.MONGO_URL as string;

export const ConnectDB = async () => {
   try {
      const connection = await mongoose.connect(mongoUrl);
      console.log(
         `Database connected on ${connection.connection.host}`.bgGreen.white,
      );
   } catch (error) {
      console.log(`Database not Connected `.bgRed.white, error);
      process.exit(1);
   }
};
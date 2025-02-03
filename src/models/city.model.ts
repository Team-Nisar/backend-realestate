import mongoose, { Document, Schema, Model } from "mongoose";

export interface ICity extends Document {
   cityName: string;
   cityImage: string;
   CreatedBy: {
      _id: mongoose.Types.ObjectId;
      role: string;
   };
}

const CitySchema: Schema = new Schema(
   {
      cityName: {
         type: String,
         required: true,
         trim: true,
      },
      cityImage: {
         type: String,
         required: true,
         trim: true,
      },
      CreatedBy: {
         _id: {
            type: Schema.Types.ObjectId,
            ref: "admin",
            required: true,
         },
         role: {
            type: String,
            required: true,
            enum: ["admin", "manager"], // Adjust roles as needed
         },
      },
   },
   {
      timestamps: true, // Adds createdAt and updatedAt fields
   }
);

const City: Model<ICity> = mongoose.model<ICity>("City", CitySchema);

export default City;

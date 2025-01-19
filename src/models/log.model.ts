import mongoose, { Schema, Document, model } from "mongoose";

export interface ILog extends Document {
  userId: string;
  ip: string;
  api: string;
  timestamp: Date;
}

const LogSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    ip: { type: String, required: true },
    api: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Log = model<ILog>("Log", LogSchema);

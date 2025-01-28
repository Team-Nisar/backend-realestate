import mongoose, { Document, Schema, model } from "mongoose";

export interface IUser extends Document {
  fname: string;
  lname: string;
  countryCode: string;
  phone: string;
  email: string;
  password: string;
  WAMobile: string;
  dob: Date;
  gender: 'male' | 'female'| 'other';
  address?: [{
    street?: string;
    area?: string;
    city?: string;
    zipcode?: string;
    state?: string;
    country?: string;
  }];
  role: 'individual' | 'agent';
  resetPasswordToken?: string;
  resetPasswordTokenExpiry?: Date;
  isDeleted: boolean;
  isBlocked: boolean;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    fname: { type: String, required: true, trim: true },
    lname: { type: String, required: true, trim: true },
    countryCode: { type: String, default: '+91' },
    phone: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: { type: String, required: true },
    WAMobile: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'male' },
    address: [
      {
        street: { type: String },
        area: { type: String },
        city: { type: String },
        zipcode: { type: String },
        state: { type: String },
        country: { type: String },
      },
    ],
    role: { type: String, enum: ['individual', 'agent'], default: 'individual' },
    resetPasswordToken: { type: String },
    resetPasswordTokenExpiry: { type: Date },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model<IUser>("user", UserSchema);

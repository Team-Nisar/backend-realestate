import mongoose, { Document, Schema, model } from "mongoose";

export interface IAdmin extends Document {
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
  role: 'admin' | 'manager';
  resetPasswordToken?: string;
  resetPasswordTokenExpiry?: Date;
  isDeleted: boolean;
  isBlocked: boolean;
}

const AdminSchema: Schema = new Schema<IAdmin>(
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
    role: { type: String, enum: ['admin', 'manager'], default: 'manager' },
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

export const Admin = model<IAdmin>("admin", AdminSchema);

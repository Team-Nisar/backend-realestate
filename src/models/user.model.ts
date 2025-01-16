import mongoose, { model, Schema } from "mongoose";

export interface IUser extends Document{
  fname: string;
  mname?: string;
  lname: string;
  countryCode: string;
  phone: string;
  isPhoneVerified: boolean;
  email: string;
  isEmailVerified: boolean;
  dob: Date;
  gender: 'male' | 'female';
  address?: [object];
  role: 'individual' | 'agent';
  tempPhone?: string;
  tempCountryCode?: string;
  tempEmail?: string; 
}

const UserSchema: Schema = new Schema<IUser>({
  fname:{
    type: String,
    required: [true, 'First Name is Required'],
    trim: true
  },
  mname:{
    type: String,
    trim: true
  },
  lname:{
    type: String,
    required: [true, 'Last Name is Required'],
    trim: true
  },
  countryCode:{
    type: String,
    default: '+91'
  },
  phone:{
    type: String,
    required: [true, 'Please provide a phone number'],
    unique: true
  },
  isPhoneVerified:{
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  isEmailVerified:{
    type: Boolean,
    default: false,
  },
  dob:{
    type: Date,
    required: [true, 'DOB is Required']
  },
  gender:{
    type: String,
    enum: ['male', 'female'],
    default: 'male'
  },
  address:[
      {
        street: {
          type: String,
        },
        area: {
          type: String,
        },
        city: {
          type: String,
        },
        zipcode: {
          type: String,
        },
        state: {
          type: String,
        },
        country: {
          type: String,
        },
      },
    ],
  role: {
    type: String,
    enum: ['individul', 'agent'],
    default: 'individual'
  },
  tempEmail: { type: String },
  tempPhone: { type: String },
  tempCountryCode: { type: String },
},
{
  timestamps: true,
  versionKey: false,
}
);

export const User = model<IUser>('user', UserSchema);
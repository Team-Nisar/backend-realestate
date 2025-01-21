import mongoose, { model, Schema } from "mongoose";

export interface IUser extends Document{
  fname: string;
  lname: string;
  countryCode: string;
  phone: string;
  email: string;
  //isEmailVerified: boolean;
  password: string;
  WAMobile: string;
  dob: Date;
  gender: 'male' | 'female';
  address?: [
    street: string,
    area: string,
    city: string,
    zipcode: string,
    state: string,
    country: string,
];
  role: 'individual' | 'agent';
  resetPasswordToken?: string;
  resetPasswordTokenExpiry?: Date;
  isDeleted: boolean;
  isBlocked: boolean;
}

const UserSchema: Schema = new Schema<IUser>({
  fname:{
    type: String,
    required: [true, 'First Name is Required'],
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
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  // isEmailVerified:{
  //   type: Boolean,
  //   default: false,
  // },
  password:{
    type: String,
    required: [true, "Password is Required"]
  },
  WAMobile:{
    type: String,
    required: [true, "WhatsApp Number is Required"]
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
    enum: ['individual', 'agent'],
    default: 'individual'
  },
  resetPasswordToken:{
    type: String
  },
  resetPasswordTokenExpiry:{
    type: Date
  },
  isDeleted:{
    type: Boolean,
    default: false
  },
  isBlocked: {
    type: Boolean,
    default: false
  }
},
{
  timestamps: true,
  versionKey: false,
}
);

export const User = model<IUser>('user', UserSchema);
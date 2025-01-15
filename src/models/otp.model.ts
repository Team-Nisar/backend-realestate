import { Schema, Document, model } from "mongoose";

export enum OtpTypes {
   Signup = 'SIGN_UP',
   Login = 'LOGIN',
   UpdateEmail = 'UPDATE_EMAIL',
   UpdatePhone = 'UPDATE_PHONE',
   VerifyExistingEmail = 'VERIFY_EXISTING_EMAIL',
   VerifyExistingPhone = 'VERIFY_EXISTING_PHONE',
}
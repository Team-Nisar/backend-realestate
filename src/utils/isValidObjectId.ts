import mongoose from "mongoose"
// Validate MongoDB ObjectId
export const isValidObjectId = (id: string): boolean => {
   return typeof id === 'string' && mongoose.Types.ObjectId.isValid(id);
};
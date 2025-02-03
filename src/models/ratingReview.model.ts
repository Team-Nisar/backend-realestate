import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document{
   rating: number;
   review: string;
   _propertyId: Schema.Types.ObjectId;
   reViewBy:{
      _id: Schema.Types.ObjectId;
      role: string;
   }
   isDeleted: boolean;
   isShow: boolean;
}

const ReviewSchema = new Schema<IReview>({
   rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
   },
   review: {
      type: String,
      required: true
   },
   _propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property", // Assuming the Property model is referenced here
      required: true
   },
   reViewBy: {
      _id: {
         type: Schema.Types.ObjectId,
         ref: "User", // Assuming the User model is referenced here
         required: true
      },
      role: {
         type: String,
         required: true
      }
   },
   isDeleted: {
      type: Boolean,
      default: false
   },
   isShow: {
      type: Boolean,
      default: true
   }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Create a model from the schema
const Review = mongoose.model<IReview>("review", ReviewSchema);

export default Review;
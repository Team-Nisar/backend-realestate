import { Request, Response } from "express";
import { User } from "../../../models/user.model";

export const getUserDetails = async (req: Request, res: Response): Promise<any> => {
  try {
    // Get user ID from the authenticated request
    const userId = req.user?._id;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required." });
    }

    // Fetch user details from the database
    const user = await User.findById(userId).select("-password -resetPasswordToken -resetPasswordTokenExpiry");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Send user details
    return res.status(200).json({ 
      success: true, 
      message: "User details retrieved successfully.", 
      data: user 
    });
  } catch (error) {
    console.error("Error retrieving user details:", error);
    return res.status(500).json({ success: false, message: "An error occurred while retrieving user details.", error: error.message });
  }
};

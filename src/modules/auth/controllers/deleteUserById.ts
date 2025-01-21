import { Request, Response } from "express";
import { User } from "../../../models/user.model";

// Delete User by ID Controller
export const deleteUserById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { _id } = req.user?._id;

    // Find the user by ID and set isDeleted to true
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Mark the user as deleted without removing the record from the database
    user.isDeleted = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

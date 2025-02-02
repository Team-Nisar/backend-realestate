import {Request, Response} from 'express'
import { User } from '../../../models/user.model';
import bcrypt from 'bcrypt'

export const changePassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.user?._id;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Check for missing fields
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'Old password, new password, and confirm password are required.' });
    }
    if(newPassword.length < 6 || confirmPassword.length < 6){
      return res.status(400).json({message: "Password must greater than 6 character !"})
    }
    // Check if newPassword and confirmPassword match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New password and confirm password do not match.' });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.', id: userId });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Old password is incorrect.' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: 'Your password has been changed successfully.' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
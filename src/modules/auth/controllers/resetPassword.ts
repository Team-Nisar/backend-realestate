import { Request, Response } from "express"
import { User } from "../../../models/user.model"
import bcrypt from 'bcrypt'
import crypto from 'crypto'


export const resetPassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const { token } = req.query;
    const { newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required.' });
    }

    const hashedToken = crypto.createHash('sha256').update(token.toString()).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Reset password token is invalid or has expired.' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear the reset token fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    await user.save();

    return res.status(200).json({ message: 'Your password has been updated successfully.' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
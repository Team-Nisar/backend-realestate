import { Request, Response } from "express";
import crypto from 'crypto';
import { User } from "../../../models/user.model";
import { sendPasswordResetEmail } from "../../../services/email.service";
import jwt from 'jsonwebtoken';

export const forgotPassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email } = req.body;

    // Check if user exists with the provided email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'No account exists with the provided email address.' });
    }

    // Generate a token valid for 5 minutes
    const token = jwt.sign({ id: user._id }, process.env.JWT_PASS_SEC, {
      expiresIn: "5m",
    });

    // Hash the token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Store the hashed token in the user's record
    user.resetPasswordToken = hashedToken;
    user.resetPasswordTokenExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes in milliseconds
    await user.save();

    // Send the reset password email
    await sendPasswordResetEmail(user, token);

    return res.status(200).json({
      Success: true,
      message: 'A reset password URL has been sent to your email.',
      data: {
        _user: user._id,
        token: token,
      },
    });
  } catch (error) {
    return res.status(500).json({ Success: false, message: "Somthing went wrong", error: error.message });
  }
};

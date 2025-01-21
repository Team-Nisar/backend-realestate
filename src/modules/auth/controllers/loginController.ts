import {Request, Response} from 'express';
import { User } from '../../../models/user.model';
import { generate_token } from '../../../helpers/jwtHelper';
import bcrypt from 'bcrypt';
import { isValidEmail } from '../../../utils/validEmail';
import sanitizeInput from '../../../utils/sanitizeInput';

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);

    // Check for missing fields
    if (!sanitizedEmail || !sanitizedPassword) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Validate email format
    if (!isValidEmail(sanitizedEmail)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    // Find the user by email
    const user = await User.findOne({ email: sanitizedEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(sanitizedPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const payload = {
        _id: user._id.toString(),
        role: user.role,
      }
    // Generate a JWT token
    const token = generate_token(payload);

    return res.status(200).json({Success: true, message: "Login successful.", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ Success: false, message: "An error occurred while logging in.", error: error.message });
  }
};

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
    if (!user || user.isDeleted === true) {
      return res.status(404).json({ message: "User not found." });
    }
    if(user.isBlocked === true){
      return res.status(400).json({message: "You can not login, because you are Blocked !"})
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(sanitizedPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password." });
    }

    const payload = {
        _id: user._id.toString(),
        role: user.role,
      }
    // Generate a JWT token
    const token = generate_token(payload);
    const options = {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    }
    return res.cookie("token", token, options).status(200).json({
      Success: true, 
      message: "Login Successful.", 
      token, 
      user:{
        _id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        countryCode: user.countryCode,
        phone: user.phone,
        WAMobile: user.WAMobile,
        gender: user.gender,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ Success: false, message: "An error occurred while logging in.", error: error.message });
  }
};

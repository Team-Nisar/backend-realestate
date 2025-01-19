import { Application, Request, Response } from "express";
import { User } from "../../../models/user.model";
import bcrypt from 'bcrypt';
import { isValidEmail } from "../../../utils/validEmail";
import { isValidTenDigitMobile } from "../../../utils/validMobile";
import sanitizeInput from '../../../utils/sanitizeInput';

// Register Controller
export const RegisterUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      fname,
      lname,
      countryCode,
      phone,
      email,
      password,
      confirmPassword,
      dob,
      gender,
      address,
      role,
    } = req.body;

    // Sanitize inputs
    const sanitizedFname = sanitizeInput(fname);
    const sanitizedLname = sanitizeInput(lname);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPhone = sanitizeInput(phone);
    const sanitizedDob = sanitizeInput(dob);

    // Check for missing fields
    const requiredFields = { fname, lname, phone, email, password, confirmPassword, dob, gender };
    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value || value.toString().trim() === "") {
        return res.status(400).json({ message: `${key} is required.` });
      }
    }

    // Validate email format
    if (!isValidEmail(sanitizedEmail)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    // Validate phone number format
    if (!isValidTenDigitMobile(sanitizedPhone)) {
      return res.status(400).json({ message: "Invalid phone number format. It must be a 10-digit number." });
    }

    // Validate date of birth format
    const dobDate = new Date(sanitizedDob);
    if (isNaN(dobDate.getTime())) {
      return res.status(400).json({ message: "Invalid date of birth format." });
    }

    // Validate password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    // Check if user with the same email or phone already exists
    const existingUser = await User.findOne({ $or: [{ email: sanitizedEmail }, { phone: sanitizedPhone }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email or phone number already registered." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user object
    const newUser = new User({
      fname: sanitizedFname,
      lname: sanitizedLname,
      countryCode: countryCode || "+91", // Default to '+91'
      phone: sanitizedPhone,
      email: sanitizedEmail,
      password: hashedPassword,
      dob: dobDate,
      gender,
      address: address || [], // Default to empty array if no address is provided
      role: role || "individual", // Default to 'individual'
    });

    // Save the user to the database
    await newUser.save();

    return res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while registering the user.", error: error.message });
  }
};

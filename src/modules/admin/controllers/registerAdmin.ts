import { Application, Request, Response } from "express";
import {Admin } from "../../../models/admin.model";
import bcrypt from 'bcrypt';
import { isValidEmail } from "../../../utils/validEmail";
import { isValidTenDigitMobile } from "../../../utils/validMobile";
import sanitizeInput from '../../../utils/sanitizeInput';
import { sendEmail } from "../../../services/email.service";

// Register Controller
export const RegisterAdmin = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      fname,
      lname,
      countryCode,
      phone,
      email,
      password,
      confirmPassword,
      WAMobile,
      dob,
      gender,
      street,
      area,
      city,
      zipcode,
      state,
      country,
      role,
    } = req.body;

    // Sanitize inputs
    const sanitizedFname = sanitizeInput(fname);
    const sanitizedLname = sanitizeInput(lname);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPhone = sanitizeInput(phone);
    const sanitizedWAMobile = sanitizeInput(WAMobile);
    const sanitizedDob = sanitizeInput(dob);

    // Check for missing fields
    const requiredFields = { fname, lname, phone, email, password, WAMobile ,confirmPassword, dob, gender };
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

    // Validate WhatsApp Mobile
    if (!isValidTenDigitMobile(sanitizedWAMobile)) {
      return res.status(400).json({ message: "Invalid WhatsApp number format. It must be a 10-digit number." });
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
    const existingUser = await Admin.findOne({ $or: [{ email: sanitizedEmail }, { phone: sanitizedPhone }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email or phone number already registered. Please Login." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user object
    const newUser = new Admin({
      fname: sanitizedFname,
      lname: sanitizedLname,
      countryCode: countryCode || "+91", // Default to '+91'
      phone: sanitizedPhone,
      email: sanitizedEmail,
      password: hashedPassword,
      WAMobile: sanitizedWAMobile,
      dob: dobDate,
      gender,
      address: [
        {
          street: street ? sanitizeInput(street) : undefined,
          area: area ? sanitizeInput(area) : undefined,
          city: city ? sanitizeInput(city) : undefined,
          zipcode: zipcode ? sanitizeInput(zipcode) : undefined,
          state: state ? sanitizeInput(state) : undefined,
          country: country ? sanitizeInput(country) : undefined,
        }
      ], // Address should be an array of objects
      role: role || "manager", // Default to 'manager'
    });

    // Save the user to the database
    await newUser.save();

    // Prepare details for email
    const detailsUser: any = {
      fname: newUser.fname,
      lname: newUser.lname,
      countryCode: newUser.countryCode,
      phone: newUser.phone,
      email: newUser.email,
      WAMobile: newUser.WAMobile,
      dob: newUser.dob,
      gender: newUser.gender,
      address: newUser.address,
      role: newUser.role
    };

    // Send email confirmation
    await sendEmail(detailsUser);

    return res.status(201).json({ Success: true, message: "Admin registered successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ Success: false, message: "An error occurred while registering the Admin.", error: error.message });
  }
};

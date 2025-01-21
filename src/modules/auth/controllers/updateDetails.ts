import { Application, Request, Response } from "express";
import { IUser, User } from "../../../models/user.model";
import { isValidEmail } from "../../../utils/validEmail";
import { isValidTenDigitMobile } from "../../../utils/validMobile";
import sanitizeInput from '../../../utils/sanitizeInput';
import { sendUpdateEmail } from "../../../services/email.service";

// Update User Details Controller
export const UpdateUserDetails = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.user?._id;  // Get user ID from URL parameters
    const {
      fname,
      lname,
      countryCode,
      phone,
      email,
      WAMobile,
      dob,
      gender,
      address,
      role,
    } = req.body;

    // Sanitize inputs
    const sanitizedFname = fname ? sanitizeInput(fname) : undefined;
    const sanitizedLname = lname ? sanitizeInput(lname) : undefined;
    const sanitizedEmail = email ? sanitizeInput(email) : undefined;
    const sanitizedPhone = phone ? sanitizeInput(phone) : undefined;
    const sanitizedWAMobile = WAMobile ? sanitizeInput(WAMobile) : undefined;
    const sanitizedDob = dob ? sanitizeInput(dob) : undefined;

    // Find user by ID
    const existingUser = await User.findById(userId);
    if (!existingUser || existingUser.isDeleted) {
      return res.status(404).json({ message: "User not found." });
    }
    if(existingUser.isBlocked === true){
      return res.status(400).json({message: "You can not update Details. You are Blocked !"})
    }
    // Validate email format if provided
    if (sanitizedEmail && !isValidEmail(sanitizedEmail)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    // Validate phone number format if provided
    if (sanitizedPhone && !isValidTenDigitMobile(sanitizedPhone)) {
      return res.status(400).json({ message: "Invalid phone number format. It must be a 10-digit number." });
    }

    // Validate WhatsApp number format if provided
    if (sanitizedWAMobile && !isValidTenDigitMobile(sanitizedWAMobile)) {
      return res.status(400).json({ message: "Invalid WhatsApp number format. It must be a 10-digit number." });
    }

    // Validate date of birth if provided
    if (sanitizedDob && isNaN(new Date(sanitizedDob).getTime())) {
      return res.status(400).json({ message: "Invalid date of birth format." });
    }

    // Check if email or phone already exists for other users (excluding current user)
    if (sanitizedEmail && sanitizedEmail !== existingUser.email) {
      const emailExists = await User.findOne({ email: sanitizedEmail, _id: { $ne: userId } });
      if (emailExists) {
        return res.status(400).json({ message: "Email is already registered by another user." });
      }
      existingUser.email = sanitizedEmail;
    }

    if (sanitizedPhone && sanitizedPhone !== existingUser.phone) {
      const phoneExists = await User.findOne({ phone: sanitizedPhone, _id: { $ne: userId } });
      if (phoneExists) {
        return res.status(400).json({ message: "Phone number is already registered by another user." });
      }
      existingUser.phone = sanitizedPhone;
    }

    // Update user details
    if (sanitizedFname) existingUser.fname = sanitizedFname;
    if (sanitizedLname) existingUser.lname = sanitizedLname;
    if (countryCode) existingUser.countryCode = countryCode;
    if (sanitizedPhone) existingUser.phone = sanitizedPhone;
    if (sanitizedEmail) existingUser.email = sanitizedEmail;
    if (sanitizedWAMobile) existingUser.WAMobile = sanitizedWAMobile;
    if (sanitizedDob) existingUser.dob = new Date(sanitizedDob);
    if (gender) existingUser.gender = gender;
    if (address) existingUser.address = address;
    if (role) existingUser.role = role;

    // Save the updated user to the database
    await existingUser.save();
    const updatedUserDetails: any = {
      fname: existingUser.fname,
      lname: existingUser.lname,
      countryCode: existingUser.countryCode,
      phone: existingUser.phone,
      email: existingUser.email,
      WAMobile: existingUser.WAMobile,
      dob: existingUser.dob,
      gender: existingUser.gender,
      address: existingUser.address,
      role: existingUser.role
    };

    // Send email confirmation for update
    await sendUpdateEmail(updatedUserDetails);
    return res.status(200).json({ Success: true, message: "User details updated successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ Success: false, message: "An error occurred while updating the user details.", error: error.message });
  }
};

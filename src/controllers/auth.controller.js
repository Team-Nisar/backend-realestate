const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { sendSMS } = require('../services/twilio.service');
const { sendEmail } = require('../services/email.service');
const { generateOTP, generateToken } = require('../utils');



exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, city } = req.body;

    // Check if user exists
    let user = await User.findOne({ $or: [{ email }, { phone }] });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes


    let hashedPassword = "";
    if(password) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
       hashedPassword = await bcrypt.hash(password, salt);
    }


    // Send OTP via SMS
    await sendSMS(phone, `Your verification code is: ${otp}`);

    // Create user
    user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      city,
      otp: {
        code: otp,
        expiresAt: otpExpiry
      }
    });


    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      message: 'Registration successful. Please verify your phone number.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = {
      code: otp,
      expiresAt: otpExpiry
    };
    await user.save();

    // Send OTP via SMS
    await sendSMS(phone, `Your verification code is: ${otp}`);  

    res.status(200).json({
      success: true,
      message: 'OTP resent successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
    }
  };

exports.verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.otp.code !== otp || user.otp.expiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    // Send welcome email
    await sendEmail(user);

    res.status(200).json({
      success: true,
      message: 'Phone number verified successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { phone } = req.body;

    const user = await User.findOne({ phone }).select('+phone');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate and send OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = {
      code: otp,
      expiresAt: otpExpiry
    };
    await user.save();

    await sendSMS(phone, `Your login verification code is: ${otp}`);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

exports.verifyLoginOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.otp.code !== otp || user.otp.expiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    user.otp = undefined;
    await user.save();

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      message: 'Login successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
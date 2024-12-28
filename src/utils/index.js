const jwt = require('jsonwebtoken');
exports.generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};
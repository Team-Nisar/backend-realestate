const express = require('express');
const { register, verifyOTP, login, verifyLoginOTP, resendOtp } = require('../controllers/auth.controller');
const authorize = require('../middleware/authorize');
const router = express.Router();

router.post('/register', register);
router.post('/resend-otp', authorize, resendOtp);
router.post('/verify-otp',authorize, verifyOTP);
router.post('/login', login);
router.post('/verify-login-otp', verifyLoginOTP);

module.exports = router;
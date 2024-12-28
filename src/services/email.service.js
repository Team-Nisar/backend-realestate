const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_PASS
  }
});

const sendEmail = async (user) => {
  try {
    await transporter.sendMail({
      from: process.env.GMAIL,
      to: user.email,
      subject: 'Welcome to Our Platform',
      html: `
        <h1>Welcome ${user.name}!</h1>
        <p>Thank you for registering with us. Your account has been successfully created.</p>
        <p>Your registered email: ${user.email}</p>
        <p>Your registered phone: ${user.phone}</p>
      `
    });
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
};

module.exports = { sendEmail };
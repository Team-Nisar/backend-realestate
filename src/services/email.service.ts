import nodemailer from "nodemailer";

// Configure the transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_PASS,
  },
});

// Define the user type for TypeScript
export interface User {
  fname: string;
  lname: string;
  countryCode: string;
  phone: string;
  email: string;
  WAMobile: string;
  dob: Date;
  gender: 'male' | 'female';
  address?: [{
    street: string,
    area: string,
    city: string,
    zipcode: string,
    state: string,
    country: string,
  }];
  role: 'individual' | 'agent';
}

// Function to send email
 export const sendEmail = async (user: User): Promise<boolean> => {
  try {
    await transporter.sendMail({
      from: process.env.GMAIL,
      to: user.email,
      subject: "🎉 Welcome to Our Platform!",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h1 style="color: #4CAF50;">Welcome, ${user.fname} ${user.lname}!</h1>
          <p>We're thrilled to have you on board. Your account has been successfully created, and we're excited to help you get started!</p>
          <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
          <h3>Your Registration Details:</h3>
          <ul style="list-style: none; padding: 0; font-size: 14px;">
            <li><strong>Email:</strong> ${user.email}</li>
            <li><strong>Phone:</strong> ${user.countryCode}-${user.phone}</li>
            <li><strong>WhatsApp:</strong> ${user.WAMobile}</li>
            <li><strong>Date of Birth:</strong> ${new Date(user.dob).toLocaleDateString()}</li>
            <li><strong>Role:</strong> ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</li>
          </ul>
          ${user.address ? `
            <h4>Address:</h4>
            <p style="margin: 0;">${user.address[0].street}, ${user.address[0].area},</p>
            <p style="margin: 0;">${user.address[0].city}, ${user.address[0].state}, ${user.address[0].country}, ${user.address[0].zipcode}</p>
          ` : ''}
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <p style="margin-top: 20px; font-size: 12px; color: #555;">Thank you for choosing our platform.<br>The Support Team</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("Email error:", error);
    return false;
  }
};

export const sendUpdateEmail = async (user: User): Promise<boolean> => {
  try {
    await transporter.sendMail({
      from: process.env.GMAIL,
      to: user.email,
      subject: "🔔 Your Profile Has Been Updated Successfully!",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h1 style="color: #4CAF50;">Hello, ${user.fname} ${user.lname}!</h1>
          <p>We wanted to let you know that your account details have been successfully updated.</p>
          <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
          <h3>Your Updated Details:</h3>
          <ul style="list-style: none; padding: 0; font-size: 14px;">
            ${user.email ? `<li><strong>Email:</strong> ${user.email}</li>` : ''}
            ${user.phone ? `<li><strong>Phone:</strong> ${user.countryCode}-${user.phone}</li>` : ''}
            ${user.WAMobile ? `<li><strong>WhatsApp:</strong> ${user.WAMobile}</li>` : ''}
            ${user.dob ? `<li><strong>Date of Birth:</strong> ${new Date(user.dob).toLocaleDateString()}</li>` : ''}
            ${user.role ? `<li><strong>Role:</strong> ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</li>` : ''}
          </ul>
          ${user.address && user.address.length > 0 ? `
            <h4>Updated Address:</h4>
            <p style="margin: 0;">${user.address[0].street}, ${user.address[0].area},</p>
            <p style="margin: 0;">${user.address[0].city}, ${user.address[0].state}, ${user.address[0].country}, ${user.address[0].zipcode}</p>
          ` : ''}
          <p>If you notice any discrepancies in your information or have any questions, please don't hesitate to contact our support team.</p>
          <p style="margin-top: 20px; font-size: 12px; color: #555;">Thank you for being a valued member.<br>The Support Team</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("Email error:", error);
    return false;
  }
};




export const sendPasswordResetEmail = async (user: any, token: string) => {
  const resetUrl = `${process.env.LOCALHOST_URL}/reset-password?token=${token}`;
  // Assuming a transporter instance is already set up for sending emails
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: user.email,
    subject: '🔒 Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hi <strong>${user.fname || "User"}</strong>,</p>
        <p>You are receiving this email because we received a password reset request for your account.</p>
        <p style="margin: 20px 0;"><a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Reset Your Password</a></p>
        <p>If you’re having trouble with the button above, copy and paste the URL below into your web browser:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p style="color: #555; font-size: 0.9em;">This link will expire in 5 minutes. If you did not request this, please ignore this email or contact support if you have concerns.</p>
        <p>Thank you,<br>The Support Team</p>
      </div>
    `,
  });
};


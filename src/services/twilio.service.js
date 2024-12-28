const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const isPhoneNumberValid = (phoneNumber) => {
  // Validate E.164 format: starts with '+' followed by country code and digits
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phoneNumber);
};

const sendSMS = async (to, message) => {
  if (!isPhoneNumberValid(to)) {
    console.error(`Invalid phone number format: ${to}`);
    return false;
  }

  // Check if the number is a short code (typically 5-6 digits)
  if (/^\d{5,6}$/.test(to)) {
    console.error(`Invalid recipient: Short codes cannot receive SMS. Number: ${to}`);
    return false;
  }

  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_NUMBER,
      to
    });
    console.log('SMS sent successfully to:', to);
    return true;
  } catch (error) {
    console.error('Twilio SMS error:', error.message || error);
    if (error.code === 21265) {
      console.error('Error 21265: The recipient number is a short code.');
    } else if (error.code === 21211) {
      console.error('Error 21211: Invalid phone number.');
    }
    return false;
  }
};

module.exports = { sendSMS };

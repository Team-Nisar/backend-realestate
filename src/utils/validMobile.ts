// /**
//  * Validate 10-digit mobile number
//  * @param phoneNumber - Mobile number to validate
//  * @returns boolean - true if the phone number is valid, otherwise false
//  */
export const isValidTenDigitMobile = (phoneNumber: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/; // Ensures the number starts with 6-9 and has exactly 10 digits
  return phoneRegex.test(phoneNumber);
};
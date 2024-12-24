// Validate mobile number (example format: +91-1234567890)
export const isValidMobileNumber = (mobile: string): boolean => {
   if (typeof mobile !== 'string') return false;
   const mobileRegex = /^\+\d{1,3}-\d{10}$/;
   return mobileRegex.test(mobile);
};
// Validate email format
export const isValidEmail = (email: string): boolean => {
   if (typeof email !== 'string') return false;
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   return emailRegex.test(email);
};

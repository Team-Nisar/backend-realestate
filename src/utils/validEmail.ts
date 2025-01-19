import * as validator from 'validator';

// /**
//  * Validate email address
//  * @param email - Email address to validate
//  * @returns boolean - true if email is valid, otherwise false
//  */
export const isValidEmail = (email: string): boolean => {
  return validator.isEmail(email);
};
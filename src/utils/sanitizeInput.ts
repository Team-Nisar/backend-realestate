// /**
//  * Sanitizes a given input by removing potentially harmful characters
//  * or patterns, preventing XSS or other injection attacks.
//  *
//  * @param input - The user-provided input (string, array, or object).
//  * @returns - The sanitized input.
//  */
const sanitizeInput = (input: any): any => {
  if (typeof input === "string") {
    return input
      .replace(/<script.*?>.*?<\/script>/gi, "") // Remove <script> tags
      .replace(/<[a-z][\s\S]*?>/gi, "") // Remove HTML tags
      .replace(/on\w+=".*?"/gi, "") // Remove inline event handlers
      .replace(/javascript:/gi, "") // Remove `javascript:` URLs
      .trim(); // Remove leading and trailing spaces
  } else if (Array.isArray(input)) {
    return input.map((item) => sanitizeInput(item)); // Recursively sanitize arrays
  } else if (typeof input === "object" && input !== null) {
    const sanitizedObject: { [key: string]: any } = {};
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        sanitizedObject[key] = sanitizeInput(input[key]); // Recursively sanitize object properties
      }
    }
    return sanitizedObject;
  }
  return input; // Return the input as-is if not a string, array, or object
};

export default sanitizeInput;

const jwt = require('jsonwebtoken');

// Middleware to authorize requests and extract user ID from JWT
const authorize = (req, res, next) => {
    try {
      // Get the token from the Authorization header
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token is required' });
      }

      const token = authHeader.split(' ')[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Add user ID to the request object
      req.userId = decoded.id;

      // Continue to the next middleware or route handler
      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };

module.exports = authorize;

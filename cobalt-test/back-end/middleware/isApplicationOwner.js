const jwt = require('jsonwebtoken');

// Middleware to check if the user is an Application Owner
const isApplicationOwner = (req, res, next) => {
  // Get token from the Authorization header (bearer token)
  const token = req.header('Authorization') && req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token and extract the user information
    const decoded = jwt.verify(token, 'jwt_secret');
    
    // Check if the user role is Application Owner
    if (decoded.role !== 'app_owner' && decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. User is not authorised to perform this action.' });
    }
    
    // Store the user info in the request object for later use in routes
    req.user = decoded;
    next(); // Continue to the next middleware/route handler
    
  } catch (error) {
    console.error('JWT Verification failed:', error);
    return res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = isApplicationOwner;

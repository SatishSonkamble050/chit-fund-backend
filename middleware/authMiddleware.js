// const jwt = require('jsonwebtoken');
// const User = require('../models/userModel');
// const Organization = require('../models/organizationModel');

// exports.verifyUser = async (req, res, next) => {
//   const token = req.headers['authorization']?.split(' ')[1];
//   if (!token) return res.status(403).json({ message: 'No token provided' });

//   try {
//     const decoded = jwt.verify(token, 'YOUR_SECRET_KEY');
//     req.user = await User.findById(decoded.userId);
//     if (!req.user) return res.status(404).json({ message: 'User not found' });
    
//     // Optionally verify organization
//     req.organization = await Organization.findById(req.user.tenantId);
//     if (!req.organization) return res.status(404).json({ message: 'Organization not found' });

//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Unauthorized' });
//   }
// };


const jwt = require('jsonwebtoken');

// Middleware to verify token and extract ID
const authenticateToken = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // Unauthorized

  // Verify token
  jwt.verify(token, 'hellobrother', (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.userId = user.id; // Attach user ID to request object
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = authenticateToken; 


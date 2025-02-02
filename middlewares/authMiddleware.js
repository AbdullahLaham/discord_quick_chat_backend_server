// authMiddleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config();
// Middleware function to authenticate JWT token
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];  // Expecting 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ message: 'No token provided. Authorization denied.' });
  }

  // Verify the token
  jwt.verify(token, 'testsecret', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token. Authorization denied.' });
    }


    // Attach the decoded user info to the request object
    req.user = decoded;
    next();  // Move to the next middleware or route handler
  });
};

export default authMiddleware;

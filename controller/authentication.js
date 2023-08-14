// In your middleware.js

const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = localStorage.getItem('token'); // Get token from localStorage
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken };

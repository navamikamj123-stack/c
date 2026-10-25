const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { getImpact } = require('../controllers/impactController');
const { JWT_SECRET } = require('../middleware/auth');

// Optional auth middleware: extracts user if token provided
const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = { id: decoded.id };
    } catch {
      // Ignore invalid token for optional auth
    }
  }
  next();
};

router.get('/', optionalAuth, getImpact);

module.exports = router;

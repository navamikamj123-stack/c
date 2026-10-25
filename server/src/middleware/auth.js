const jwt = require('jsonwebtoken');
const { getStorage } = require('../data/storage');

const JWT_SECRET = process.env.JWT_SECRET || 'ecoconnect_super_secret_jwt_key_2026_modern';

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Please log in to continue.',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const storage = getStorage();
    const user = await storage.findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      });
    }

    req.user = {
      _id: user._id.toString(),
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location,
    };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication token is invalid or expired.',
      error: error.message,
    });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Administrator privileges required.',
    });
  }
};

module.exports = { protect, adminOnly, JWT_SECRET };

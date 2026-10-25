const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getStorage } = require('../data/storage');
const { JWT_SECRET } = require('../middleware/auth');

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, location, bio, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email address, and password.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const storage = getStorage();
    const existing = await storage.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await storage.createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: 'user',
      location: location ? location.trim() : 'Local Community Area',
      bio: bio ? bio.trim() : 'EcoConnect community member.',
      phone: phone ? phone.trim() : '',
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to EcoConnect.',
      token,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        bio: user.bio,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration. Please try again.',
      error: err.message,
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const storage = getStorage();
    const user = await storage.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. No account found with this email.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. The password you entered is incorrect.',
      });
    }

    const token = generateToken(user._id);

    return res.json({
      success: true,
      message: 'Login successful! Welcome back.',
      token,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        bio: user.bio,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during login.',
      error: err.message,
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const storage = getStorage();
    const user = await storage.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.json({
      success: true,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        bio: user.bio,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const { name, location, bio, phone } = req.body;
    const storage = getStorage();

    const updated = await storage.updateUser(req.user.id, {
      name: name ? name.trim() : req.user.name,
      location: location !== undefined ? location.trim() : req.user.location,
      bio: bio !== undefined ? bio.trim() : undefined,
      phone: phone !== undefined ? phone.trim() : undefined,
    });

    return res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        _id: updated._id,
        id: updated._id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        location: updated.location,
        bio: updated.bio,
        phone: updated.phone,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { register, login, getMe, updateProfile };

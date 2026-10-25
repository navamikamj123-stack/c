const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const { connectDB, getDBStatus } = require('./config/db');

// Route Handlers
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const communityRequestRoutes = require('./routes/communityRequestRoutes');
const impactRoutes = require('./routes/impactRoutes');
const adminRoutes = require('./routes/adminRoutes');
const recyclingRoutes = require('./routes/recyclingRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for local college presentation demo
      }
    },
    credentials: true,
  })
);

// Express Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health & Database Diagnostics Endpoint
app.get('/api/health', (req, res) => {
  const dbInfo = getDBStatus();
  res.json({
    status: 'ok',
    service: 'EcoConnect API Server',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: dbInfo,
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/community-requests', communityRequestRoutes);
app.use('/api/impact', impactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/recycling', recyclingRoutes);
app.use('/api/reports', reportRoutes);

// Root Welcome Endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to EcoConnect API Server – Give More, Waste Less.',
    documentation: '/api/health',
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`,
  });
});

// Central Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error occurred.',
  });
});

// Initialize Database & Start Server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🌱 EcoConnect REST API Server running on port ${PORT}`);
    console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🌍 Client URL configured: http://localhost:5173`);
    console.log(`=======================================================`);
  });
};

startServer();

module.exports = app;

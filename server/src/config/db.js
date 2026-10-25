const mongoose = require('mongoose');

let isMongoConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecoconnect';
  try {
    // Attempt MongoDB connection with 2.5 second timeout so server starts immediately even without local mongod
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    isMongoConnected = true;
    console.log(`[EcoConnect DB] MongoDB Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isMongoConnected = false;
    console.warn(`\n[EcoConnect DB Notice] MongoDB server not reached (${error.message}).`);
    console.info(`[EcoConnect DB Status] ACTIVE: Development Persistent JSON Engine.`);
    console.info(`[EcoConnect DB] All User Auth, Items, Requests, and Admin actions will persist seamlessly.\n`);
    return false;
  }
};

const getDBStatus = () => ({
  connected: isMongoConnected,
  type: isMongoConnected ? 'MongoDB' : 'Development Fallback (Local JSON Storage)',
  databaseName: 'ecoconnect',
  uri: isMongoConnected ? (process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecoconnect') : null,
  note: isMongoConnected 
    ? 'Connected directly to MongoDB instance.'
    : 'Running in resilient development fallback mode. Provide a running MongoDB instance or Atlas URI in .env to switch automatically.'
});

module.exports = { connectDB, getDBStatus, getIsConnected: () => isMongoConnected };

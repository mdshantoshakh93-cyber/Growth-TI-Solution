const mongoose = require('mongoose');

// Disable command buffering when disconnected
mongoose.set('bufferCommands', false);

let isConnected = false;

const connectDB = async () => {
  const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/growth_it_db';

  try {
    console.log(`[Database] Connecting to MongoDB at ${connUri}...`);
    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 3000,
    });

    isConnected = true;
    console.log(`[Database] Mongoose Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    isConnected = false;
    console.warn(`[Database Warning] Could not establish MongoDB connection (${error.message}).`);
    console.warn('[Database Fallback] Server running with graceful offline state without crashing.');
  }
};

mongoose.connection.on('disconnected', () => {
  if (isConnected) {
    console.warn('[Database] Mongoose connection lost.');
    isConnected = false;
  }
});

mongoose.connection.on('reconnected', () => {
  console.log('[Database] Mongoose reconnected to MongoDB server.');
  isConnected = true;
});

const getDBStatus = () => {
  return {
    connected: isConnected && mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host || 'Disconnected',
    name: mongoose.connection.name || 'N/A',
  };
};

module.exports = { connectDB, getDBStatus };

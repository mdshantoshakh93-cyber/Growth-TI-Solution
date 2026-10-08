require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

// Catch Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.error(`[Uncaught Exception] ${err.name}: ${err.message}`);
  console.error(err.stack);
});

// Connect to MongoDB
connectDB();

// Start HTTP Server
const server = app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 Growth IT Solution Enterprise API Server`);
  console.log(`🌐 API Endpoint: http://localhost:${PORT}/api/health`);
  console.log(`🔧 Environment:  ${process.env.NODE_ENV || 'development'}`);
  console.log('====================================================');
});

// Catch Unhandled Promise Rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection] ${err.name}: ${err.message}`);
  // Keep server alive gracefully instead of crashing
});

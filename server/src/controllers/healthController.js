const { getDBStatus } = require('../config/db');

const getHealth = (req, res) => {
  const dbStatus = getDBStatus();
  return res.status(200).json({
    success: true,
    message: 'Growth IT Solution API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: dbStatus,
  });
};

module.exports = { getHealth };

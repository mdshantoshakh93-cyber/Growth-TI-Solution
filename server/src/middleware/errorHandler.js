const { sendError } = require('../utils/responseHandler');

/**
 * Central Error Handling Middleware
 * Ensures stack traces are never exposed in production environment.
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[Error Handler] ${err.name}: ${err.message}`);

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  const isProd = process.env.NODE_ENV === 'production';

  const message = err.message || 'Internal Server Error';
  const errors = isProd ? undefined : err.stack;

  return sendError(res, message, statusCode, errors);
};

module.exports = errorHandler;

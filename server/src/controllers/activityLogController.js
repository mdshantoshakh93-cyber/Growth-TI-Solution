const ActivityLog = require('../models/ActivityLog');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const getLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(100);
    return sendSuccess(res, logs, 'Activity logs retrieved');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

const createLog = async (req, res) => {
  try {
    const log = await ActivityLog.create({
      ...req.body,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    return sendSuccess(res, log, 'Activity log created', 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

module.exports = { getLogs, createLog };

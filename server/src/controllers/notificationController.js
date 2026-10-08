const Notification = require('../models/Notification');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    return sendSuccess(res, notifications, 'Notifications retrieved');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

const createNotification = async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    return sendSuccess(res, notification, 'Notification created', 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

module.exports = { getNotifications, createNotification };

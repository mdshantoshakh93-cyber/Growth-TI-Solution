const ContactMessage = require('../models/ContactMessage');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return sendSuccess(res, messages, 'Contact messages retrieved');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

const submitMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return sendError(res, 'Name, email, and message are required', 400);
    }
    const record = await ContactMessage.create({
      ...req.body,
      ipAddress: req.ip,
    });
    return sendSuccess(res, record, 'Thank you for reaching out! Your message has been received.', 201);
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

module.exports = { getMessages, submitMessage };

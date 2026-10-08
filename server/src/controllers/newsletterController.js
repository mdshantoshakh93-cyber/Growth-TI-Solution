const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const getSubscribers = async (req, res) => {
  try {
    const subs = await NewsletterSubscriber.find({ status: 'active' }).sort({ createdAt: -1 });
    return sendSuccess(res, subs, 'Newsletter subscribers retrieved');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return sendError(res, 'Valid email address is required', 400);
    }
    const existing = await NewsletterSubscriber.findOne({ email });
    if (existing) {
      return sendSuccess(res, existing, 'Email is already subscribed to newsletter');
    }
    const sub = await NewsletterSubscriber.create({ email });
    return sendSuccess(res, sub, 'Successfully subscribed to Growth IT newsletter!', 201);
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

module.exports = { getSubscribers, subscribe };

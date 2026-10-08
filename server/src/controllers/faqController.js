const FAQ = require('../models/FAQ');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find({ isActive: true }).sort({ order: 1 });
    return sendSuccess(res, faqs, 'FAQs retrieved');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

const createFAQ = async (req, res) => {
  try {
    const faq = await FAQ.create(req.body);
    return sendSuccess(res, faq, 'FAQ created', 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

module.exports = { getFAQs, createFAQ };

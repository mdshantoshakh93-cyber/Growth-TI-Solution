const Testimonial = require('../models/Testimonial');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isFeatured: true }).sort({ createdAt: -1 });
    return sendSuccess(res, testimonials, 'Testimonials retrieved');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

const createTestimonial = async (req, res) => {
  try {
    const item = await Testimonial.create(req.body);
    return sendSuccess(res, item, 'Testimonial created', 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

module.exports = { getTestimonials, createTestimonial };

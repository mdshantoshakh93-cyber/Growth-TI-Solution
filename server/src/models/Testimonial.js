const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true },
    company: { type: String, required: true },
    avatar: { type: String, default: '' },
    quote: { type: String, required: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    isFeatured: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);

const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    category: { type: String, required: true, index: true },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: 'Globe' },
    features: [{ type: String }],
    startingPrice: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);

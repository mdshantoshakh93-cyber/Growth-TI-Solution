const mongoose = require('mongoose');

const pricingPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    price: { type: Number, required: true },
    billingCycle: { type: String, enum: ['monthly', 'annually', 'one-time'], default: 'one-time' },
    description: { type: String, required: true },
    features: [{ type: String }],
    isPopular: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PricingPlan', pricingPlanSchema);

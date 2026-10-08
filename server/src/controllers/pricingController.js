const PricingPlan = require('../models/PricingPlan');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const getPricingPlans = async (req, res) => {
  try {
    const plans = await PricingPlan.find().sort({ price: 1 });
    return sendSuccess(res, plans, 'Pricing plans retrieved');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

const createPricingPlan = async (req, res) => {
  try {
    const plan = await PricingPlan.create(req.body);
    return sendSuccess(res, plan, 'Pricing plan created', 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

module.exports = { getPricingPlans, createPricingPlan };

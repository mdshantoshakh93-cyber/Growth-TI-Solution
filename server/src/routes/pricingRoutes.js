const express = require('express');
const router = express.Router();
const { getPricingPlans, createPricingPlan } = require('../controllers/pricingController');

router.get('/', getPricingPlans);
router.post('/', createPricingPlan);

module.exports = router;

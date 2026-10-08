const express = require('express');
const router = express.Router();
const { getFAQs, createFAQ } = require('../controllers/faqController');

router.get('/', getFAQs);
router.post('/', createFAQ);

module.exports = router;

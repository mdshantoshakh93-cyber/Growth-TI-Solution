const express = require('express');
const router = express.Router();
const { getSubscribers, subscribe } = require('../controllers/newsletterController');

router.get('/', getSubscribers);
router.post('/', subscribe);

module.exports = router;

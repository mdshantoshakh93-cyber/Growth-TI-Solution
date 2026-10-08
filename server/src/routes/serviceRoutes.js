const express = require('express');
const router = express.Router();
const { getServices, getServiceBySlug, createService } = require('../controllers/serviceController');

router.get('/', getServices);
router.get('/:slug', getServiceBySlug);
router.post('/', createService);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getApplications, submitApplication } = require('../controllers/applicationController');

router.get('/', getApplications);
router.post('/', submitApplication);

module.exports = router;

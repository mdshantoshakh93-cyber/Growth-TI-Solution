const express = require('express');
const router = express.Router();
const { getNavigation, createNavigation } = require('../controllers/navigationController');

router.get('/', getNavigation);
router.post('/', createNavigation);

module.exports = router;

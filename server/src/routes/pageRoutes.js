const express = require('express');
const router = express.Router();
const { getPages, getPageBySlug, createPage } = require('../controllers/pageController');

router.get('/', getPages);
router.get('/:slug', getPageBySlug);
router.post('/', createPage);

module.exports = router;

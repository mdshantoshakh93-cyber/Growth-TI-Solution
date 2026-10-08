const express = require('express');
const router = express.Router();
const { getPosts, getPostBySlug, createPost } = require('../controllers/blogController');

router.get('/', getPosts);
router.get('/:slug', getPostBySlug);
router.post('/', createPost);

module.exports = router;

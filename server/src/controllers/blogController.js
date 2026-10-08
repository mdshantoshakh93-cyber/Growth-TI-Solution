const BlogPost = require('../models/BlogPost');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const getPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find({ status: 'published' }).sort({ publishedAt: -1 });
    return sendSuccess(res, posts, 'Blog posts retrieved');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

const getPostBySlug = async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug });
    if (!post) return sendError(res, 'Blog post not found', 404);
    return sendSuccess(res, post, 'Blog post details retrieved');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

const createPost = async (req, res) => {
  try {
    const post = await BlogPost.create(req.body);
    return sendSuccess(res, post, 'Blog post created successfully', 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

module.exports = { getPosts, getPostBySlug, createPost };

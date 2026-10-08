const Page = require('../models/Page');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const getPages = async (req, res) => {
  try {
    const pages = await Page.find({ isPublished: true }).sort({ createdAt: -1 });
    return sendSuccess(res, pages, 'Pages retrieved');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

const getPageBySlug = async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug, isPublished: true });
    if (!page) return sendError(res, 'Page not found', 404);
    return sendSuccess(res, page, 'Page details retrieved');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

const createPage = async (req, res) => {
  try {
    const page = await Page.create(req.body);
    return sendSuccess(res, page, 'Page created', 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

module.exports = { getPages, getPageBySlug, createPage };

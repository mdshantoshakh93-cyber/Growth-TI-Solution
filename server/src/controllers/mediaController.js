const Media = require('../models/Media');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const getMedia = async (req, res) => {
  try {
    const items = await Media.find().sort({ createdAt: -1 });
    return sendSuccess(res, items, 'Media items retrieved');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

const createMedia = async (req, res) => {
  try {
    const item = await Media.create(req.body);
    return sendSuccess(res, item, 'Media file uploaded', 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

module.exports = { getMedia, createMedia };

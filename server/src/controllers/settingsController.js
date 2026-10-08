const SiteSettings = require('../models/SiteSettings');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    return sendSuccess(res, settings, 'Site settings retrieved');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

const updateSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (settings) {
      settings = await SiteSettings.findByIdAndUpdate(settings._id, req.body, { new: true });
    } else {
      settings = await SiteSettings.create(req.body);
    }
    return sendSuccess(res, settings, 'Site settings updated');
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

module.exports = { getSettings, updateSettings };

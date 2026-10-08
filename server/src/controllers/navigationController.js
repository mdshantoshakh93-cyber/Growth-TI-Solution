const Navigation = require('../models/Navigation');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const getNavigation = async (req, res) => {
  try {
    const { location } = req.query;
    const filter = location ? { location } : {};
    const navs = await Navigation.find(filter);
    return sendSuccess(res, navs, 'Navigation retrieved');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

const createNavigation = async (req, res) => {
  try {
    const nav = await Navigation.create(req.body);
    return sendSuccess(res, nav, 'Navigation menu created', 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

module.exports = { getNavigation, createNavigation };

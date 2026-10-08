const TeamMember = require('../models/TeamMember');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const getTeam = async (req, res) => {
  try {
    const team = await TeamMember.find({ isActive: true }).sort({ order: 1 });
    return sendSuccess(res, team, 'Team members retrieved');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

const createTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.create(req.body);
    return sendSuccess(res, member, 'Team member added', 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

module.exports = { getTeam, createTeamMember };

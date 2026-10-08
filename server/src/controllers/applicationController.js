const JobApplication = require('../models/JobApplication');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const getApplications = async (req, res) => {
  try {
    const apps = await JobApplication.find().populate('jobId', 'title department').sort({ createdAt: -1 });
    return sendSuccess(res, apps, 'Job applications retrieved');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

const submitApplication = async (req, res) => {
  try {
    const app = await JobApplication.create(req.body);
    return sendSuccess(res, app, 'Job application submitted successfully', 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

module.exports = { getApplications, submitApplication };

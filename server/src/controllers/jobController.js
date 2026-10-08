const Job = require('../models/Job');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'open' }).sort({ createdAt: -1 });
    return sendSuccess(res, jobs, 'Open jobs retrieved');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

const createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);
    return sendSuccess(res, job, 'Job posting created', 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

module.exports = { getJobs, createJob };

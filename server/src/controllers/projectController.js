const Project = require('../models/Project');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const getProjects = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category: new RegExp(category, 'i') } : {};
    const projects = await Project.find(filter).sort({ createdAt: -1 });
    return sendSuccess(res, projects, 'Projects retrieved successfully', 200, { count: projects.length });
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

const getProjectBySlug = async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project) return sendError(res, 'Project not found', 404);
    return sendSuccess(res, project, 'Project details retrieved');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    return sendSuccess(res, project, 'Project created successfully', 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

module.exports = { getProjects, getProjectBySlug, createProject };

const express = require('express');
const router = express.Router();
const { getProjects, getProjectBySlug, createProject } = require('../controllers/projectController');

router.get('/', getProjects);
router.get('/:slug', getProjectBySlug);
router.post('/', createProject);

module.exports = router;

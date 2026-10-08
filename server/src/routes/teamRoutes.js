const express = require('express');
const router = express.Router();
const { getTeam, createTeamMember } = require('../controllers/teamController');

router.get('/', getTeam);
router.post('/', createTeamMember);

module.exports = router;

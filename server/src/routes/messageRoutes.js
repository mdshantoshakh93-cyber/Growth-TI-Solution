const express = require('express');
const router = express.Router();
const { getMessages, submitMessage } = require('../controllers/messageController');

router.get('/', getMessages);
router.post('/', submitMessage);

module.exports = router;

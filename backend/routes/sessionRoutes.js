const express = require('express');
const { createSession, markAttendance } = require('../controllers/sessionController');
const router = express.Router();

router.post('/', createSession);
router.put('/attendance', markAttendance);

module.exports = router;

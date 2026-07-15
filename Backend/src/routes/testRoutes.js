const express = require('express');
const router = express.Router();

const authorize = require("../middleware/roleMiddleware");
const ROLES = require('../constants/roles');
const protect = require('../middleware/authMiddleware');

router.get('/employee', protect, authorize(ROLES.ADMIN, ROLES.EMPLOYEE, ROLES.FINANCE), (req, res) => {
    res.status(200).json({ success: true, message: 'Access Granted' });
});

router.get('/finance', protect, authorize(ROLES.FINANCE, ROLES.ADMIN), (req, res) => {
    res.status(200).json({ success: true, message: 'Access Granted' });
});

router.get('/admin', protect, authorize(ROLES.ADMIN), (req, res) => {
    res.status(200).json({ success: true, message: 'Access Granted' });
});

module.exports = router;
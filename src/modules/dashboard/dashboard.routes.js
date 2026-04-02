const express = require('express');
const dashboardController = require('./dashboard.controller');
const verifyToken = require('../../middleware/auth');
const requireRoles = require('../../middleware/rbac');

const router = express.Router();

// Dashboard routes are readable by all roles.
router.use(verifyToken, requireRoles(['VIEWER', 'ANALYST', 'ADMIN']));

router.get('/summary', dashboardController.getSummary);
router.get('/by-category', dashboardController.getCategoryTotals);
router.get('/trends', dashboardController.getMonthlyTrends);

module.exports = router;

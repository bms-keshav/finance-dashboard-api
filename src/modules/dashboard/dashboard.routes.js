const express = require('express');
const dashboardController = require('./dashboard.controller');
const verifyToken = require('../../middleware/auth');
const requireRoles = require('../../middleware/rbac');

const router = express.Router();

// All dashboard routes require ANALYST or ADMIN role
router.use(verifyToken, requireRoles(['ANALYST', 'ADMIN']));

router.get('/summary', dashboardController.getSummary);
router.get('/by-category', dashboardController.getCategoryTotals);
router.get('/trends', dashboardController.getMonthlyTrends);

module.exports = router;

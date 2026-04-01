const express = require('express');
const userController = require('./user.controller');
const verifyToken = require('../../middleware/auth');
const requireRoles = require('../../middleware/rbac');

const router = express.Router();

// All user routes require an admin role
router.use(verifyToken, requireRoles(['ADMIN']));

router.get('/', userController.getAllUsers);
router.patch('/:id/role', userController.updateRole);
router.patch('/:id/status', userController.updateStatus);

module.exports = router;

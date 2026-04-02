const express = require('express');
const { check, param } = require('express-validator');
const userController = require('./user.controller');
const verifyToken = require('../../middleware/auth');
const requireRoles = require('../../middleware/rbac');

const router = express.Router();

// All user routes require an admin role
router.use(verifyToken, requireRoles(['ADMIN']));

router.get('/', userController.getAllUsers);
router.patch(
    '/:id/role',
    [
        param('id', 'Invalid user id').isMongoId(),
        check('role', 'Role must be one of VIEWER, ANALYST, ADMIN').isIn(['VIEWER', 'ANALYST', 'ADMIN']),
    ],
    userController.updateRole
);

router.patch(
    '/:id/status',
    [
        param('id', 'Invalid user id').isMongoId(),
        check('status', 'Status must be ACTIVE or INACTIVE').isIn(['ACTIVE', 'INACTIVE']),
    ],
    userController.updateStatus
);

module.exports = router;

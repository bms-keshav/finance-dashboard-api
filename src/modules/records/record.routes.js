const express = require('express');
const { check } = require('express-validator');
const recordController = require('./record.controller');
const verifyToken = require('../../middleware/auth');
const requireRoles = require('../../middleware/rbac');

const router = express.Router();

// All routes in this module require a valid token
router.use(verifyToken);

router.post(
    '/',
    requireRoles(['ADMIN']),
    [
        check('amount', 'Amount must be a positive number').isFloat({ gt: 0 }),
        check('type', 'Type must be either INCOME or EXPENSE').isIn(['INCOME', 'EXPENSE']),
        check('category', 'Category is required').not().isEmpty(),
        check('date', 'A valid date is required').isISO8601().toDate(),
    ],
    recordController.createRecord
);

router.get('/', requireRoles(['VIEWER', 'ANALYST', 'ADMIN']), recordController.getAllRecords);
router.get('/:id', requireRoles(['VIEWER', 'ANALYST', 'ADMIN']), recordController.getRecordById);
router.patch('/:id', requireRoles(['ADMIN']), recordController.updateRecord);
router.delete('/:id', requireRoles(['ADMIN']), recordController.deleteRecord);

module.exports = router;

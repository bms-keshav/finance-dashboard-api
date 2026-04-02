const express = require('express');
const { body, check, param, query } = require('express-validator');
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

router.get(
    '/',
    requireRoles(['ANALYST', 'ADMIN']),
    [
        query('type', 'Type must be INCOME or EXPENSE').optional().isIn(['INCOME', 'EXPENSE']),
        query('category', 'Category must be a string').optional().isString(),
        query('startDate', 'startDate must be a valid ISO date').optional().isISO8601(),
        query('endDate', 'endDate must be a valid ISO date').optional().isISO8601(),
        query('page', 'page must be an integer >= 1').optional().isInt({ min: 1 }).toInt(),
        query('limit', 'limit must be an integer between 1 and 100').optional().isInt({ min: 1, max: 100 }).toInt(),
    ],
    recordController.getAllRecords
);

router.get(
    '/:id',
    requireRoles(['ANALYST', 'ADMIN']),
    [param('id', 'Invalid record id').isMongoId()],
    recordController.getRecordById
);

router.patch(
    '/:id',
    requireRoles(['ADMIN']),
    [
        param('id', 'Invalid record id').isMongoId(),
        body().custom((value, { req }) => {
            const allowedFields = ['amount', 'type', 'category', 'date', 'notes'];
            const payloadFields = Object.keys(req.body || {});

            if (payloadFields.length === 0) {
                throw new Error('At least one field is required for update.');
            }

            const invalidFields = payloadFields.filter((field) => !allowedFields.includes(field));
            if (invalidFields.length > 0) {
                throw new Error(`Invalid fields: ${invalidFields.join(', ')}`);
            }

            return true;
        }),
        check('amount', 'Amount must be a positive number').optional().isFloat({ gt: 0 }),
        check('type', 'Type must be either INCOME or EXPENSE').optional().isIn(['INCOME', 'EXPENSE']),
        check('category', 'Category cannot be empty').optional().isString().not().isEmpty(),
        check('date', 'Date must be a valid ISO date').optional().isISO8601().toDate(),
        check('notes', 'Notes must be a string').optional().isString(),
    ],
    recordController.updateRecord
);

router.delete(
    '/:id',
    requireRoles(['ADMIN']),
    [param('id', 'Invalid record id').isMongoId()],
    recordController.deleteRecord
);

module.exports = router;

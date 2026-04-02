const userService = require('./user.service');
const { validationResult } = require('express-validator');
const { successResponse, errorResponse } = require('../../utils/apiResponse');

const getAllUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
        successResponse(res, 200, users, 'Successfully retrieved all users');
    } catch (err) {
        next(err);
    }
};

const updateRole = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorResponse(res, 400, 'VALIDATION_ERROR', 'Invalid input', errors.array());
    }

    try {
        const { id } = req.params;
        const { role } = req.body;
        const updatedUser = await userService.updateUserRole(id, role);

        if (!updatedUser) {
            return errorResponse(res, 404, 'NOT_FOUND', 'User not found');
        }

        successResponse(res, 200, updatedUser, 'User role updated successfully');
    } catch (err) {
        next(err);
    }
};

const updateStatus = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorResponse(res, 400, 'VALIDATION_ERROR', 'Invalid input', errors.array());
    }

    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedUser = await userService.updateUserStatus(id, status);

        if (!updatedUser) {
            return errorResponse(res, 404, 'NOT_FOUND', 'User not found');
        }

        successResponse(res, 200, updatedUser, 'User status updated successfully');
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllUsers,
    updateRole,
    updateStatus,
};

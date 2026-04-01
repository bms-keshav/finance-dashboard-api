const userService = require('./user.service');
const { successResponse } = require('../../utils/apiResponse');

const getAllUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
        successResponse(res, 200, users, 'Successfully retrieved all users');
    } catch (err) {
        next(err);
    }
};

const updateRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const updatedUser = await userService.updateUserRole(id, role);
        successResponse(res, 200, updatedUser, 'User role updated successfully');
    } catch (err) {
        next(err);
    }
};

const updateStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedUser = await userService.updateUserStatus(id, status);
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

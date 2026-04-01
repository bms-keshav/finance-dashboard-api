const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userService = require('../users/user.service');
const { successResponse, errorResponse } = require('../../utils/apiResponse');

const register = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorResponse(res, 400, 'VALIDATION_ERROR', 'Invalid input', errors.array());
    }

    try {
        const { email, name, password, role } = req.body;

        const existingUser = await userService.findUserByEmail(email);
        if (existingUser) {
            return errorResponse(res, 409, 'CONFLICT', 'User with this email already exists.');
        }

        const newUser = await userService.createUser({ name, email, password, role });

        successResponse(res, 201, newUser, 'User registered successfully.');
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorResponse(res, 400, 'VALIDATION_ERROR', 'Invalid input', errors.array());
    }

    try {
        const { email, password } = req.body;

        const user = await userService.findUserByEmail(email);
        if (!user) {
            return errorResponse(res, 401, 'UNAUTHORIZED', 'Invalid email or password.');
        }

        if (user.status === 'INACTIVE') {
            return errorResponse(res, 403, 'FORBIDDEN', 'Your account is inactive. Please contact an administrator.');
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return errorResponse(res, 401, 'UNAUTHORIZED', 'Invalid email or password.');
        }

        const payload = {
            userId: user._id,
            role: user.role,
            email: user.email,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '1h',
        });

        const userObject = user.toObject();
        delete userObject.passwordHash;

        successResponse(res, 200, { token, user: userObject }, 'Login successful.');
    } catch (err) {
        next(err);
    }
};

module.exports = {
    register,
    login,
};

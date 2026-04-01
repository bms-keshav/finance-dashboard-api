const authService = require('../services/auth.service');
const { successResponse } = require('../utils/apiResponse');
const { validationResult } = require('express-validator');

class AuthController {
    async register(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await authService.register(req.body);
            successResponse(res, 'User registered successfully', user, 201);
        } catch (err) {
            next(err);
        }
    }

    async login(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        try {
            const { user, token } = await authService.login(req.body);
            successResponse(res, 'Login successful', { user, token });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new AuthController();

const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/apiResponse');
const User = require('../models/user.model');

const verifyToken = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return errorResponse(res, 'No token provided', 403);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).where('isDeleted').equals(false);

        if (!user) {
            return errorResponse(res, 'Failed to authenticate token', 401);
        }

        req.user = user;
        next();
    } catch (err) {
        return errorResponse(res, 'Failed to authenticate token', 401);
    }
};

const requireRoles = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return errorResponse(res, 'Authentication required', 401);
        }

        const hasRole = roles.some(role => req.user.roles.includes(role));
        if (!hasRole) {
            return errorResponse(res, 'Forbidden', 403);
        }

        next();
    };
};

module.exports = {
    verifyToken,
    requireRoles,
};

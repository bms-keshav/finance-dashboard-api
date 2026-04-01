const { errorResponse } = require('../utils/apiResponse');

const requireRoles = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return errorResponse(res, 403, 'FORBIDDEN', 'Access denied. User role not available.');
    }

    const hasRole = allowedRoles.includes(req.user.role);
    if (!hasRole) {
      return errorResponse(res, 403, 'FORBIDDEN', 'You do not have permission to perform this action.');
    }

    next();
  };
};

module.exports = requireRoles;

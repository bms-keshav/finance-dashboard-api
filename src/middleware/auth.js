const jwt = require('jsonwebtoken');
const User = require('../modules/users/user.model');
const { errorResponse } = require('../utils/apiResponse');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 401, 'UNAUTHORIZED', 'Missing or invalid token');
  }

  const token = authHeader.split(' ')[1];
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return errorResponse(res, 401, 'UNAUTHORIZED', 'Invalid token');
  }

  try {
    const user = await User.findById(decoded.userId).select('email role status');

    if (!user) {
      return errorResponse(res, 401, 'UNAUTHORIZED', 'Invalid token');
    }

    if (user.status === 'INACTIVE') {
      return errorResponse(res, 403, 'FORBIDDEN', 'Your account is inactive. Please contact an administrator.');
    }

    req.user = {
      userId: user._id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = verifyToken;

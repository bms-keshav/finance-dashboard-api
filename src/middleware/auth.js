const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/apiResponse');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 401, 'UNAUTHORIZED', 'Missing or invalid token');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return errorResponse(res, 401, 'UNAUTHORIZED', 'Invalid token');
  }
};

module.exports = verifyToken;

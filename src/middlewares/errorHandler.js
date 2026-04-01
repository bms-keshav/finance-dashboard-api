const { errorResponse } = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    errorResponse(res, err.message || 'Internal Server Error');
};

module.exports = errorHandler;

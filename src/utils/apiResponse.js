const successResponse = (res, statusCode = 200, data = null, message = 'Success') => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

const errorResponse = (res, statusCode = 500, errorCode = 'ERROR', message, errors = null) => {
    return res.status(statusCode).json({
        success: false,
        errorCode,
        message,
        ...(errors && { errors }) 
    });
};

module.exports = {
    successResponse,
    errorResponse,
};

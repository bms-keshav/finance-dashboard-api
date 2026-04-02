require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { errorResponse } = require('./utils/apiResponse');

// Import modular routes
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/user.routes');
const recordRoutes = require('./modules/records/record.routes');
const dashboardRoutes = require('./modules/dashboard/dashboard.routes');

const app = express();

// Core Middleware
app.use(express.json());
app.use(cors());

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 Not Found Handler
app.use((req, res, next) => {
    errorResponse(res, 404, 'NOT_FOUND', 'The requested route does not exist.');
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);

    if (err.name === 'CastError') {
        return errorResponse(res, 400, 'VALIDATION_ERROR', `Invalid value for ${err.path}`);
    }

    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((e) => ({
            field: e.path,
            message: e.message,
        }));
        return errorResponse(res, 400, 'VALIDATION_ERROR', 'Validation failed', errors);
    }

    if (err.code === 11000) {
        return errorResponse(res, 409, 'CONFLICT', 'Duplicate value violates a unique constraint.');
    }

    const message = process.env.NODE_ENV === 'production' ? 'An unexpected error occurred.' : err.message;
    return errorResponse(res, 500, 'INTERNAL_ERROR', message);
});

module.exports = app;


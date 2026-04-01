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
    const message = process.env.NODE_ENV === 'production' ? 'An unexpected error occurred.' : err.message;
    errorResponse(res, 500, 'INTERNAL_ERROR', message);
});

module.exports = app;


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/auth.routes');

const app = express();

// Connect to database
connectDB();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);

// Global error handler
app.use(errorHandler);

module.exports = app;

const dashboardService = require('./dashboard.service');
const { successResponse } = require('../../utils/apiResponse');

const getSummary = async (req, res, next) => {
    try {
        const summary = await dashboardService.getSummary();
        successResponse(res, 200, summary, 'Dashboard summary retrieved successfully');
    } catch (err) {
        next(err);
    }
};

const getCategoryTotals = async (req, res, next) => {
    try {
        const categories = await dashboardService.getCategoryTotals();
        successResponse(res, 200, categories, 'Category totals retrieved successfully');
    } catch (err) {
        next(err);
    }
};

const getMonthlyTrends = async (req, res, next) => {
    try {
        const trends = await dashboardService.getMonthlyTrends();
        successResponse(res, 200, trends, 'Monthly trends retrieved successfully');
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getSummary,
    getCategoryTotals,
    getMonthlyTrends,
};

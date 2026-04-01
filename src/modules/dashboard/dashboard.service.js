const Record = require('../records/record.model');

/**
 * Get a summary of all financial records.
 * @returns {Promise<object>}
 */
const getSummary = async () => {
    const summary = await Record.aggregate([
        { $match: { isDeleted: false } },
        {
            $group: {
                _id: null,
                totalIncome: {
                    $sum: { $cond: [{ $eq: ['$type', 'INCOME'] }, '$amount', 0] }
                },
                totalExpense: {
                    $sum: { $cond: [{ $eq: ['$type', 'EXPENSE'] }, '$amount', 0] }
                },
                totalRecords: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                totalIncome: 1,
                totalExpense: 1,
                totalRecords: 1,
                netBalance: { $subtract: ['$totalIncome', '$totalExpense'] }
            }
        }
    ]);

    return summary[0] || { totalIncome: 0, totalExpense: 0, netBalance: 0, totalRecords: 0 };
};

/**
 * Get total income and expense grouped by category.
 * @returns {Promise<object[]>}
 */
const getCategoryTotals = async () => {
    return Record.aggregate([
        { $match: { isDeleted: false } },
        {
            $group: {
                _id: '$category',
                totalIncome: {
                    $sum: { $cond: [{ $eq: ['$type', 'INCOME'] }, '$amount', 0] }
                },
                totalExpense: {
                    $sum: { $cond: [{ $eq: ['$type', 'EXPENSE'] }, '$amount', 0] }
                },
                count: { $sum: 1 }
            }
        },
        { $sort: { totalExpense: -1 } },
        {
            $project: {
                _id: 0,
                category: '$_id',
                totalIncome: 1,
                totalExpense: 1,
                count: 1
            }
        }
    ]);
};

/**
 * Get monthly income, expense, and net balance trends.
 * @returns {Promise<object[]>}
 */
const getMonthlyTrends = async () => {
    return Record.aggregate([
        { $match: { isDeleted: false } },
        {
            $group: {
                _id: {
                    year: { $year: '$date' },
                    month: { $month: '$date' }
                },
                totalIncome: {
                    $sum: { $cond: [{ $eq: ['$type', 'INCOME'] }, '$amount', 0] }
                },
                totalExpense: {
                    $sum: { $cond: [{ $eq: ['$type', 'EXPENSE'] }, '$amount', 0] }
                }
            }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        {
            $project: {
                _id: 0,
                year: '$_id.year',
                month: '$_id.month',
                totalIncome: 1,
                totalExpense: 1,
                netBalance: { $subtract: ['$totalIncome', '$totalExpense'] }
            }
        }
    ]);
};

module.exports = {
    getSummary,
    getCategoryTotals,
    getMonthlyTrends,
};

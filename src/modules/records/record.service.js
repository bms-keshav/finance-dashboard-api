const Record = require('./record.model');

/**
 * Create a new financial record
 * @param {object} recordData - { amount, type, category, date, notes, userId }
 * @returns {Promise<Record>}
 */
const createRecord = async (recordData) => {
    const { amount, type, category, date, notes, userId } = recordData;
    const record = new Record({
        amount,
        type,
        category,
        date,
        notes,
        createdBy: userId,
    });
    return record.save();
};

/**
 * Get all records with filtering and pagination
 * @param {object} filters - { type, category, startDate, endDate, page, limit }
 * @returns {Promise<{records: Record[], total: number, page: number, totalPages: number}>}
 */
const getAllRecords = async (filters) => {
    const { type, category, startDate, endDate, page = 1, limit = 10 } = filters;
    const query = { isDeleted: false };

    if (type) query.type = type;
    if (category) query.category = category;
    if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    const limitNum = parseInt(limit, 10);

    const records = await Record.find(query)
        .populate('createdBy', 'name email')
        .sort({ date: -1 })
        .skip(skip)
        .limit(limitNum);

    const total = await Record.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);

    return { records, total, page: parseInt(page, 10), totalPages };
};

/**
 * Get a single record by ID
 * @param {string} id
 * @returns {Promise<Record>}
 */
const getRecordById = async (id) => {
    return Record.findOne({ _id: id, isDeleted: false }).populate('createdBy', 'name email');
};

/**
 * Update a record by ID
 * @param {string} id
 * @param {object} fields - The fields to update
 * @returns {Promise<Record>}
 */
const updateRecord = async (id, fields) => {
    const allowedFields = ['amount', 'type', 'category', 'date', 'notes'];
    const updateFields = Object.fromEntries(
        Object.entries(fields).filter(([key]) => allowedFields.includes(key))
    );

    return Record.findOneAndUpdate(
        { _id: id, isDeleted: false },
        updateFields,
        { returnDocument: 'after', runValidators: true }
    );
};

/**
 * Soft delete a record by ID
 * @param {string} id
 * @returns {Promise<Record>}
 */
const softDeleteRecord = async (id) => {
    return Record.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { isDeleted: true },
        { returnDocument: 'after' }
    );
};

module.exports = {
    createRecord,
    getAllRecords,
    getRecordById,
    updateRecord,
    softDeleteRecord,
};

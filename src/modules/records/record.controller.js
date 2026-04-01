const recordService = require('./record.service');
const { successResponse, errorResponse } = require('../../utils/apiResponse');
const { validationResult } = require('express-validator');

const createRecord = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorResponse(res, 400, 'VALIDATION_ERROR', 'Invalid input', errors.array());
    }

    try {
        const recordData = { ...req.body, userId: req.user.userId };
        const record = await recordService.createRecord(recordData);
        successResponse(res, 201, record, 'Record created successfully');
    } catch (err) {
        next(err);
    }
};

const getAllRecords = async (req, res, next) => {
    try {
        const result = await recordService.getAllRecords(req.query);
        successResponse(res, 200, result, 'Records retrieved successfully');
    } catch (err) {
        next(err);
    }
};

const getRecordById = async (req, res, next) => {
    try {
        const record = await recordService.getRecordById(req.params.id);
        if (!record) {
            return errorResponse(res, 404, 'NOT_FOUND', 'Record not found');
        }
        successResponse(res, 200, record, 'Record retrieved successfully');
    } catch (err) {
        next(err);
    }
};

const updateRecord = async (req, res, next) => {
    try {
        const updatedRecord = await recordService.updateRecord(req.params.id, req.body);
        if (!updatedRecord) {
            return errorResponse(res, 404, 'NOT_FOUND', 'Record not found');
        }
        successResponse(res, 200, updatedRecord, 'Record updated successfully');
    } catch (err) {
        next(err);
    }
};

const deleteRecord = async (req, res, next) => {
    try {
        const deletedRecord = await recordService.softDeleteRecord(req.params.id);
        if (!deletedRecord) {
            return errorResponse(res, 404, 'NOT_FOUND', 'Record not found');
        }
        successResponse(res, 200, null, 'Record deleted successfully');
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createRecord,
    getAllRecords,
    getRecordById,
    updateRecord,
    deleteRecord,
};

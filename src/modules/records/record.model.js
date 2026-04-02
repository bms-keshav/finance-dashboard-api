const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    type: {
        type: String,
        enum: ['INCOME', 'EXPENSE'],
        required: true,
    },
    category: {
        type: String,
        required: true,
        index: true,
    },
    date: {
        type: Date,
        required: true,
        index: true,
    },
    notes: {
        type: String,
        default: '',
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Record = mongoose.model('Record', recordSchema);

module.exports = Record;

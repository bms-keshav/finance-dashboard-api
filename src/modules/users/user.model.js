const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    passwordHash: {
        type: String,
        required: true,
        select: false,
    },
    role: {
        type: String,
        enum: ['VIEWER', 'ANALYST', 'ADMIN'],
        default: 'VIEWER',
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
        default: 'ACTIVE',
    },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('passwordHash')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;

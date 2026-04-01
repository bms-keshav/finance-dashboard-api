const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    roles: {
        type: [String],
        enum: ['VIEWER', 'ANALYST', 'ADMIN'],
        default: ['VIEWER'],
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('passwordHash')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
});

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.passwordHash);
};

const User = mongoose.model('User', userSchema);

module.exports = User;

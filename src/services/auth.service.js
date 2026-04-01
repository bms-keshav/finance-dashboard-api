const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

class AuthService {
    async register(userData) {
        const { name, email, password } = userData;

        const existingUser = await User.findOne({ email, isDeleted: false });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const user = new User({
            name,
            email,
            passwordHash: password,
        });

        await user.save();

        const userObject = user.toObject();
        delete userObject.passwordHash;
        return userObject;
    }

    async login(credentials) {
        const { email, password } = credentials;

        const user = await User.findOne({ email, isDeleted: false });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const payload = {
            id: user._id,
            roles: user.roles,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        const userObject = user.toObject();
        delete userObject.passwordHash;

        return { user: userObject, token };
    }
}

module.exports = new AuthService();

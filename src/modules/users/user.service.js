const User = require('./user.model');

/**
 * Create a new user
 * @param {object} userData - { name, email, password, role }
 * @returns {Promise<User>}
 */
const createUser = async (userData) => {
    const { name, email, password, role } = userData;
    const user = new User({
        name,
        email,
        passwordHash: password, // Hashing is handled by the pre-save hook
        role,
    });
    await user.save();
    const userObject = user.toObject();
    delete userObject.passwordHash;
    return userObject;
};

/**
 * Get all users
 * @returns {Promise<User[]>}
 */
const getAllUsers = async () => {
    return User.find(); // passwordHash is excluded by default due to `select: false`
};

/**
 * Get a single user by their ID
 * @param {string} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
    return User.findById(id);
};

/**
 * Find a user by email, including the password hash
 * @param {string} email
 * @returns {Promise<User>}
 */
const findUserByEmail = async (email) => {
    return User.findOne({ email }).select('+passwordHash');
};

/**
 * Update a user's role
 * @param {string} id
 * @param {string} role
 * @returns {Promise<User>}
 */
const updateUserRole = async (id, role) => {
    return User.findByIdAndUpdate(id, { role }, { new: true, runValidators: true });
};

/**
 * Update a user's status
 * @param {string} id
 * @param {string} status
 * @returns {Promise<User>}
 */
const updateUserStatus = async (id, status) => {
    return User.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    findUserByEmail,
    updateUserRole,
    updateUserStatus,
};

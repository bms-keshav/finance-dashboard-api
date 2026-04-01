const express = require('express');
const { check } = require('express-validator');
const authController = require('./auth.controller');

const router = express.Router();

router.post(
    '/register',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    ],
    authController.register
);

router.post(
    '/login',
    [
        check('email', 'A valid email is required').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    authController.login
);

module.exports = router;

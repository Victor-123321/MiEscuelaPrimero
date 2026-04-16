'use strict';

const express = require('express');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { loginLimiter } = require('../middleware/rateLimiter');
const { loginSchema } = require('../utils/validators');

const router = express.Router();

router.post('/login', loginLimiter, validate(loginSchema), authController.login);
router.post('/logout', authenticate, authController.logout);
router.post('/verify', authenticate, authController.verify);

module.exports = router;

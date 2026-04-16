'use strict';

const express = require('express');
const { apiLimiter } = require('../middleware/rateLimiter');

const authRoutes = require('./auth.routes');
const schoolsRoutes = require('./schools.routes');
const statsRoutes = require('./stats.routes');
const contentRoutes = require('./content.routes');
const uploadRoutes = require('./upload.routes');

const router = express.Router();

router.use(apiLimiter);

router.use('/auth', authRoutes);
router.use('/schools', schoolsRoutes);
router.use('/stats', statsRoutes);
router.use('/content', contentRoutes);
router.use('/upload', uploadRoutes);

module.exports = router;

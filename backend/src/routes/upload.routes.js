'use strict';

const express = require('express');
const uploadController = require('../controllers/uploadController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/schools', authenticate, authorize('admin', 'superadmin'), uploadController.uploadSchools);
router.get('/history', authenticate, authorize('admin', 'superadmin'), uploadController.getUploadHistory);
router.get('/history/:id', authenticate, authorize('admin', 'superadmin'), uploadController.getUploadById);

module.exports = router;

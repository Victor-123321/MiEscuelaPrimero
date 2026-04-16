'use strict';

const express = require('express');
const footerController = require('../controllers/footerController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { footerUpdateSchema } = require('../utils/validators');

const router = express.Router();

router.get('/footer', footerController.getAllFooterContent);
router.put('/footer/:contentKey', authenticate, authorize('admin', 'superadmin'), validate(footerUpdateSchema), footerController.updateFooterContent);

module.exports = router;

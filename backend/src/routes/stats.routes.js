'use strict';

const express = require('express');
const statsController = require('../controllers/statsController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { statUpdateSchema } = require('../utils/validators');

const router = express.Router();

router.get('/', statsController.getAllStats);
router.put('/:statKey', authenticate, authorize('admin', 'superadmin'), validate(statUpdateSchema), statsController.updateStat);

module.exports = router;

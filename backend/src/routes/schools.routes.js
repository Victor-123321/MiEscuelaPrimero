'use strict';

const express = require('express');
const schoolController = require('../controllers/schoolController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, validateQuery } = require('../middleware/validation');
const { schoolSchema, schoolNeedSchema, paginationSchema } = require('../utils/validators');

const router = express.Router();

// Public
router.get('/filters', schoolController.getFilters);
router.get('/', validateQuery(paginationSchema), schoolController.listSchools);
router.get('/:id', schoolController.getSchool);

// Admin — schools
router.post('/',      authenticate, authorize('admin', 'superadmin'), validate(schoolSchema), schoolController.createSchool);
router.put('/:id',   authenticate, authorize('admin', 'superadmin'), schoolController.updateSchool);
router.delete('/:id', authenticate, authorize('admin', 'superadmin'), schoolController.deleteSchool);

// Admin — needs
router.post('/:id/needs',           authenticate, authorize('admin', 'superadmin'), validate(schoolNeedSchema), schoolController.addNeed);
router.put('/:id/needs/:needId',    authenticate, authorize('admin', 'superadmin'), validate(schoolNeedSchema), schoolController.updateNeed);
router.delete('/:id/needs/:needId', authenticate, authorize('admin', 'superadmin'), schoolController.deleteNeed);

module.exports = router;

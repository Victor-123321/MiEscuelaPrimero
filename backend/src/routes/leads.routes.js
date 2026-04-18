'use strict';

const express = require('express');
const { authenticate } = require('../middleware/auth');
const { createLead, listLeads, getLead, updateLeadStatus } = require('../controllers/leadController');

const router = express.Router();

// Public — donor submits the form
router.post('/', createLead);

// Admin protected
router.get('/', authenticate, listLeads);
router.get('/:id', authenticate, getLead);
router.patch('/:id/status', authenticate, updateLeadStatus);

module.exports = router;

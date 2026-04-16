'use strict';

// Set test environment before loading any modules
process.env.NODE_ENV = 'test';
process.env.DB_NAME = process.env.DB_NAME || 'mi_escuela_primero_test';
process.env.JWT_SECRET = 'test_secret_for_jest_only';
process.env.LOG_LEVEL = 'error'; // Suppress logs during tests

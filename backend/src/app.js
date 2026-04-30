'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const config = require('./config/environment');
const logger = require('./utils/logger');
const { errorHandler } = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();

// Trust reverse proxy (Koyeb, Render, etc.) so rate-limiter reads correct client IP
app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: config.cors.origin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// HTTP request logging
app.use(
  morgan('combined', {
    stream: { write: (msg) => logger.http(msg.trim()) },
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    data: { status: 'ok', env: config.env },
    message: 'MiEscuelaPrimero API is running',
    timestamp: new Date().toISOString(),
    version: 'v1',
  });
});

// API routes
app.use('/api/v1', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    errors: [{ field: 'url', message: `Ruta no encontrada: ${req.originalUrl}` }],
    message: 'Recurso no encontrado',
    timestamp: new Date().toISOString(),
    version: 'v1',
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;

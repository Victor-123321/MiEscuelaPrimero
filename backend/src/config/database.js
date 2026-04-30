'use strict';

const mysql = require('mysql2/promise');
const config = require('./environment');
const logger = require('../utils/logger');

let pool = null;

function createPool(database = config.db.name) {
  return mysql.createPool({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database,
    waitForConnections: true,
    connectionLimit: config.db.poolMax,
    queueLimit: 0,
    charset: 'utf8mb4',
    timezone: '+00:00',
  });
}

function getPool() {
  if (!pool) {
    pool = createPool();
  }
  return pool;
}

async function query(sql, params = []) {
  const start = Date.now();
  try {
    const [rows] = await getPool().query(sql, params);
    const duration = Date.now() - start;
    if (duration > 1000) {
      logger.warn('Slow query detected', { sql: sql.substring(0, 100), duration });
    }
    return rows;
  } catch (error) {
    logger.error('Database query error', { sql: sql.substring(0, 100), error: error.message });
    throw error;
  }
}

async function getConnection() {
  return getPool().getConnection();
}

async function testConnection() {
  try {
    await query('SELECT 1');
    return true;
  } catch {
    return false;
  }
}

async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

module.exports = { getPool, createPool, query, getConnection, testConnection, closePool };

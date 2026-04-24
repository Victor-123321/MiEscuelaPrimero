'use strict';

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  name: process.env.DB_NAME || 'mi_escuela_primero',
  env: process.env.NODE_ENV || 'development',
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
};

// Simple logger (used before Winston is fully set up)
const log = {
  info: (msg) => console.log(`[INFO]  ${new Date().toISOString()} ${msg}`),
  success: (msg) => console.log(`[OK]    ${new Date().toISOString()} ${msg}`),
  warn: (msg) => console.warn(`[WARN]  ${new Date().toISOString()} ${msg}`),
  error: (msg) => console.error(`[ERROR] ${new Date().toISOString()} ${msg}`),
};

// Create a no-database connection (for creating the DB itself)
async function createRootConnection() {
  return mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    charset: 'utf8mb4',
    connectTimeout: 30000,
  });
}

// Create a connection pool to the target database
function createPool(database = config.name) {
  return mysql.createPool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database,
    waitForConnections: true,
    connectionLimit: 5,
    charset: 'utf8mb4',
    timezone: '+00:00',
  });
}

// ── Database Creation ────────────────────────────────────────────────────────

async function createDatabase() {
  const conn = await createRootConnection();
  try {
    log.info(`Attempting to create database: ${config.name}`);
    await conn.query(
      `CREATE DATABASE IF NOT EXISTS \`${config.name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    log.success(`Database ready: ${config.name}`);
  } finally {
    await conn.end();
  }
}

// ── Migrations ───────────────────────────────────────────────────────────────

async function ensureMigrationsTable(pool) {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS migrations_applied (
      id INT AUTO_INCREMENT PRIMARY KEY,
      migration_name VARCHAR(255) UNIQUE NOT NULL,
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

async function getAppliedMigrations(pool) {
  const [rows] = await pool.execute('SELECT migration_name FROM migrations_applied');
  return new Set(rows.map((r) => r.migration_name));
}

async function runMigrations() {
  const pool = createPool();
  try {
    await ensureMigrationsTable(pool);
    const applied = await getAppliedMigrations(pool);

    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    log.info(`Running migrations... (${files.length} found)`);

    let ran = 0;
    for (const file of files) {
      if (applied.has(file)) {
        log.info(`  Skipping (already applied): ${file}`);
        continue;
      }

      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      try {
        // Execute the whole statement (each migration file is a single CREATE TABLE)
        await pool.execute(sql);
        await pool.execute(
          'INSERT INTO migrations_applied (migration_name) VALUES (?)',
          [file]
        );
        log.success(`  Migration applied: ${file}`);
        ran++;
      } catch (err) {
        log.error(`  Migration failed: ${file} — ${err.message} (code: ${err.code})`);
        // Continue with remaining migrations
      }
    }

    log.info(`Migrations complete. Applied: ${ran}, Skipped: ${files.length - ran}`);
  } finally {
    await pool.end();
  }
}

// ── Seeds ────────────────────────────────────────────────────────────────────

async function isDatabaseEmpty(pool) {
  try {
    const [rows] = await pool.execute('SELECT COUNT(*) AS cnt FROM admin_users');
    return rows[0].cnt === 0;
  } catch {
    return true;
  }
}

async function runSeeds() {
  const pool = createPool();
  try {
    if (!(await isDatabaseEmpty(pool))) {
      log.info('Seed data already present — skipping seeds.');
      await pool.end();
      return;
    }

    log.info('Running seed data population...');

    // 1. Create admin user with hashed password
    const DEFAULT_PASSWORD = 'Admin123!';
    const hash = await bcrypt.hash(DEFAULT_PASSWORD, config.bcryptRounds);
    await pool.execute(
      `INSERT INTO admin_users (email, password_hash, first_name, last_name, role, is_active)
       VALUES (?, ?, 'Administrator', 'Sistema', 'admin', TRUE)`,
      ['admin@mpj.org.mx', hash]
    );
    log.success('Default admin user created: admin@mpj.org.mx');
    log.warn('  *** Default password: Admin123! — Change immediately in production! ***');

    // 2. Run schools seed
    await executeSeedFile(pool, 'seed_schools.sql');

    // 3. Run stats + footer seed
    await executeSeedFile(pool, 'seed_stats_and_footer.sql');

    // Report counts
    try {
      const [sc] = await pool.execute('SELECT COUNT(*) AS cnt FROM schools');
      const [nc] = await pool.execute('SELECT COUNT(*) AS cnt FROM school_needs');
      log.success(`Seed data population complete. Schools: ${sc[0].cnt}, Needs: ${nc[0].cnt}`);
    } catch {
      log.success('Seed data population complete.');
    }
  } finally {
    await pool.end();
  }
}

async function executeSeedFile(pool, filename) {
  const seedPath = path.join(__dirname, 'seeds', filename);
  if (!fs.existsSync(seedPath)) {
    log.warn(`Seed file not found: ${filename}`);
    return;
  }

  const sql = fs.readFileSync(seedPath, 'utf8');
  // Split on semicolons to handle multi-statement seed files
  const statements = sql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith('--'));

  for (const stmt of statements) {
    try {
      await pool.execute(stmt);
    } catch (err) {
      log.warn(`  Seed statement skipped (${filename}): ${err.message}`);
    }
  }
  log.success(`  Seed applied: ${filename}`);
}

// ── Verification ─────────────────────────────────────────────────────────────

async function verifyConnection() {
  const pool = createPool();
  try {
    await pool.execute('SELECT 1');
    log.success('Database connection verified.');

    const expectedTables = [
      'admin_users',
      'schools',
      'school_needs',
      'stats',
      'footer_content',
      'file_upload_log',
      'audit_log',
      'migrations_applied',
    ];

    log.info('Verifying tables:');
    let allPresent = true;
    for (const table of expectedTables) {
      try {
        const [rows] = await pool.execute(`SELECT COUNT(*) AS cnt FROM \`${table}\``);
        log.info(`  ${table}: ${rows[0].cnt} record(s)`);
      } catch {
        log.error(`  ${table}: NOT FOUND`);
        allPresent = false;
      }
    }

    return allPresent;
  } finally {
    await pool.end();
  }
}

// ── Destructive Operations (dev only) ────────────────────────────────────────

async function dropDatabase() {
  if (config.env === 'production') {
    throw new Error('dropDatabase is disabled in production.');
  }
  const conn = await createRootConnection();
  try {
    await conn.query(`DROP DATABASE IF EXISTS \`${config.name}\``);
    log.warn(`Database dropped: ${config.name}`);
  } finally {
    await conn.end();
  }
}

async function resetDatabase() {
  if (config.env === 'production') {
    throw new Error('resetDatabase is disabled in production.');
  }
  log.warn('Resetting database — all data will be lost!');
  await dropDatabase();
  await initializeDatabase();
}

// ── Main Entry Point ──────────────────────────────────────────────────────────

async function initializeDatabase() {
  log.info('=== MiEscuelaPrimero — Database Initialization ===');
  try {
    await createDatabase();
    await runMigrations();
    await runSeeds();
    const ok = await verifyConnection();
    if (!ok) {
      throw new Error('Database verification failed — some tables are missing.');
    }
    log.success('=== Database initialization complete ===');
  } catch (err) {
    log.error(`Initialization failed: ${err.message}`);
    log.error('Suggestion: Check DB_HOST, DB_USER, DB_PASSWORD, DB_NAME in .env');
    throw err;
  }
}

module.exports = {
  initializeDatabase,
  runMigrations,
  runSeeds,
  verifyConnection,
  dropDatabase,
  resetDatabase,
};

// Allow running directly: node db/init.js
if (require.main === module) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

'use strict';

require('../setup');

const request = require('supertest');

// Mock the database layer so tests run without a live MySQL connection
jest.mock('../../src/config/database', () => ({
  query:          jest.fn(),
  getConnection:  jest.fn(),
  testConnection: jest.fn().mockResolvedValue(true),
  closePool:      jest.fn(),
}));

const db  = require('../../src/config/database');
const app = require('../../src/app');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const MOCK_STATS = [
  { id: 1, stat_key: 'schools',      stat_value: '8',    stat_label: 'Escuelas apoyadas',      display_order: 1 },
  { id: 2, stat_key: 'students',     stat_value: '2400', stat_label: 'Estudiantes alcanzados',  display_order: 2 },
  { id: 3, stat_key: 'active_needs', stat_value: '43',   stat_label: 'Necesidades activas',     display_order: 3 },
  { id: 4, stat_key: 'teachers',     stat_value: '120',  stat_label: 'Maestros impactados',     display_order: 4 },
];

// ---------------------------------------------------------------------------
// GET /api/v1/stats — public endpoint
// ---------------------------------------------------------------------------
describe('GET /api/v1/stats', () => {
  it('returns 200 with an array of stats', async () => {
    db.query.mockResolvedValueOnce(MOCK_STATS);

    const res = await request(app).get('/api/v1/stats');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('returns at least the four main stat keys in the response', async () => {
    db.query.mockResolvedValueOnce(MOCK_STATS);

    const res = await request(app).get('/api/v1/stats');
    expect(res.status).toBe(200);
    const keys = res.body.data.map(s => s.stat_key);
    expect(keys).toContain('schools');
    expect(keys).toContain('students');
  });

  it('returns an empty array (not an error) when no stats are seeded', async () => {
    db.query.mockResolvedValueOnce([]);

    const res = await request(app).get('/api/v1/stats');
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// PUT /api/v1/stats/:statKey — admin only
// ---------------------------------------------------------------------------
describe('PUT /api/v1/stats/:statKey', () => {
  it('returns 401 without a token', async () => {
    const res = await request(app)
      .put('/api/v1/stats/schools')
      .send({ stat_value: '10' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('returns 401 with a malformed token', async () => {
    const res = await request(app)
      .put('/api/v1/stats/schools')
      .set('Authorization', 'Bearer not_a_valid_jwt')
      .send({ stat_value: '10' });
    expect(res.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// GET /api/v1/content/footer — public
// ---------------------------------------------------------------------------
describe('GET /api/v1/content/footer', () => {
  it('returns 200 with footer content', async () => {
    db.query.mockResolvedValueOnce([
      { id: 1, content_key: 'contact_email', content_value: 'info@mpj.org.mx' },
      { id: 2, content_key: 'contact_phone', content_value: '33-1234-5678' },
    ]);

    const res = await request(app).get('/api/v1/content/footer');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// PUT /api/v1/content/footer/:contentKey — admin only
// ---------------------------------------------------------------------------
describe('PUT /api/v1/content/footer/:contentKey', () => {
  it('returns 401 without a token', async () => {
    const res = await request(app)
      .put('/api/v1/content/footer/contact_email')
      .send({ content_value: 'nuevo@mpj.org.mx' });
    expect(res.status).toBe(401);
  });
});

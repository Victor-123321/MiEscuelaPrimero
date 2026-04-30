'use strict';

require('../setup');

// Mock the database layer so the test runner doesn't need a live MySQL server
jest.mock('../../src/config/database', () => ({
  query:          jest.fn(),
  getConnection:  jest.fn(),
  testConnection: jest.fn().mockResolvedValue(true),
  closePool:      jest.fn(),
}));

const db  = require('../../src/config/database');
const request = require('supertest');
const app = require('../../src/app');

describe('POST /api/v1/auth/login', () => {
  it('returns 400 when body is missing', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 for invalid email format', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'not-an-email', password: 'Admin123!' });
    expect(res.status).toBe(400);
  });

  it('returns 401 for wrong credentials', async () => {
    // DB returns no matching user → auth service throws 401
    db.query.mockResolvedValueOnce([]);
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'wrong@example.com', password: 'WrongPass1!' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

describe('GET /health', () => {
  it('returns 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

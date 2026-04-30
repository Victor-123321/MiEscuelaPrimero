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
const VALID_LEAD = {
  nombre_completo:  'Juan Pérez',
  email:            'juan@empresa.com',
  tipo_instancia:   'Empresa',
  nombre_instancia: 'Empresa SA de CV',
  tipo_donativo:    'Material escolar',
  acepta_privacidad: true,
  municipio_estado: 'Guadalajara, Jalisco',
};

const MOCK_LEAD_ROW = {
  id: 1,
  ...VALID_LEAD,
  status: 'nuevo',
  created_at: new Date(),
  updated_at: new Date(),
};

// ---------------------------------------------------------------------------
// POST /api/v1/leads — public endpoint
// ---------------------------------------------------------------------------
describe('POST /api/v1/leads', () => {
  it('returns 201 when all required fields are provided', async () => {
    db.query.mockResolvedValueOnce({ insertId: 1, affectedRows: 1 });
    db.query.mockResolvedValueOnce([MOCK_LEAD_ROW]); // findById after insert

    const res = await request(app).post('/api/v1/leads').send(VALID_LEAD);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('returns 400 when nombre_completo is missing', async () => {
    const { nombre_completo: _n, ...body } = VALID_LEAD;
    const res = await request(app).post('/api/v1/leads').send(body);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 when email is missing', async () => {
    const { email: _e, ...body } = VALID_LEAD;
    const res = await request(app).post('/api/v1/leads').send(body);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 when tipo_instancia is missing', async () => {
    const { tipo_instancia: _t, ...body } = VALID_LEAD;
    const res = await request(app).post('/api/v1/leads').send(body);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 when tipo_donativo is missing', async () => {
    const { tipo_donativo: _d, ...body } = VALID_LEAD;
    const res = await request(app).post('/api/v1/leads').send(body);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 when acepta_privacidad is false', async () => {
    const res = await request(app)
      .post('/api/v1/leads')
      .send({ ...VALID_LEAD, acepta_privacidad: false });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 when acepta_privacidad is missing', async () => {
    const { acepta_privacidad: _a, ...body } = VALID_LEAD;
    const res = await request(app).post('/api/v1/leads').send(body);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// GET /api/v1/leads — admin only
// ---------------------------------------------------------------------------
describe('GET /api/v1/leads', () => {
  it('returns 401 without a token', async () => {
    const res = await request(app).get('/api/v1/leads');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('returns 401 with a malformed token', async () => {
    const res = await request(app)
      .get('/api/v1/leads')
      .set('Authorization', 'Bearer este_no_es_un_jwt_valido');
    expect(res.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// GET /api/v1/leads/:id — admin only
// ---------------------------------------------------------------------------
describe('GET /api/v1/leads/:id', () => {
  it('returns 401 without a token', async () => {
    const res = await request(app).get('/api/v1/leads/1');
    expect(res.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// PUT /api/v1/leads/:id/status — admin only
// ---------------------------------------------------------------------------
describe('PATCH /api/v1/leads/:id/status', () => {
  it('returns 401 without a token', async () => {
    const res = await request(app)
      .patch('/api/v1/leads/1/status')
      .send({ status: 'contactado' });
    expect(res.status).toBe(401);
  });

  it('returns 401 with an invalid token', async () => {
    const res = await request(app)
      .patch('/api/v1/leads/1/status')
      .set('Authorization', 'Bearer invalid')
      .send({ status: 'contactado' });
    expect(res.status).toBe(401);
  });
});

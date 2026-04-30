'use strict';

require('../setup');

const request = require('supertest');

// Mock the database layer so tests run without a live MySQL connection
jest.mock('../../src/config/database', () => ({
  query:         jest.fn(),
  getConnection: jest.fn(),
  testConnection: jest.fn().mockResolvedValue(true),
  closePool:     jest.fn(),
}));

const db = require('../../src/config/database');
const app = require('../../src/app');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const MOCK_SCHOOL = {
  id: 1,
  municipio: 'Guadalajara',
  plantel: '6D-001',
  escuela: 'Francisco Rojas González',
  personal_escolar: 12,
  estudiantes: 280,
  nivel_educativo: 'Primaria',
  cct: '14DPR0001A',
  modalidad: 'General',
  turno: 'Matutino',
  sostenimiento: 'Público',
  direccion: 'Calle Reforma 123',
  ubicacion: 'https://maps.google.com/?q=1',
  school_image_url: null,
  status: 'active',
  created_at: new Date(),
  updated_at: new Date(),
};

const MOCK_NEED = {
  id: 10,
  school_id: 1,
  categoria: 'Material',
  subcategoria: 'Útiles',
  propuesta: 'Mochilas primer grado',
  cantidad: 30,
  unidad: 'piezas',
  estado: 'Aun no cubierto',
  detalles: null,
  created_at: new Date(),
  updated_at: new Date(),
};

// ---------------------------------------------------------------------------
// GET /api/v1/schools
// ---------------------------------------------------------------------------
describe('GET /api/v1/schools', () => {
  beforeEach(() => {
    // School.findAll: COUNT first, then rows, then findNeeds per school
    db.query
      .mockResolvedValueOnce([{ total: 1 }])  // SELECT COUNT(*)
      .mockResolvedValueOnce([MOCK_SCHOOL])   // SELECT s.* ... LIMIT ? OFFSET ?
      .mockResolvedValueOnce([MOCK_NEED]);    // findNeeds for MOCK_SCHOOL
  });

  it('returns 200 with an array of schools', async () => {
    const res = await request(app).get('/api/v1/schools');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('returns pagination metadata', async () => {
    const res = await request(app).get('/api/v1/schools?limit=10&offset=0');
    expect(res.status).toBe(200);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination).toHaveProperty('total');
  });
});

// ---------------------------------------------------------------------------
// GET /api/v1/schools/:id
// ---------------------------------------------------------------------------
describe('GET /api/v1/schools/:id', () => {
  it('returns 200 with the school when it exists', async () => {
    db.query
      .mockResolvedValueOnce([MOCK_SCHOOL])  // findById
      .mockResolvedValueOnce([MOCK_NEED]);   // findNeeds

    const res = await request(app).get('/api/v1/schools/1');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(1);
  });

  it('returns 404 when school does not exist', async () => {
    db.query.mockResolvedValueOnce([]); // empty result

    const res = await request(app).get('/api/v1/schools/999');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// GET /api/v1/schools/filters
// ---------------------------------------------------------------------------
describe('GET /api/v1/schools/filters', () => {
  it('returns 200 with municipios, niveles and categorias', async () => {
    // getMunicipios → getNiveles → getCategories (Promise.all order)
    db.query
      .mockResolvedValueOnce([{ municipio: 'Guadalajara' }, { municipio: 'Zapopan' }])
      .mockResolvedValueOnce([{ nivel_educativo: 'Primaria' }])
      .mockResolvedValueOnce([{ categoria: 'Material' }, { categoria: 'Infraestructura' }]);

    const res = await request(app).get('/api/v1/schools/filters');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('municipios');
    expect(res.body.data).toHaveProperty('categorias');
    expect(res.body.data).toHaveProperty('niveles');
  });
});

// ---------------------------------------------------------------------------
// POST /api/v1/schools — requires auth
// ---------------------------------------------------------------------------
describe('POST /api/v1/schools', () => {
  it('returns 401 when no Authorization header is provided', async () => {
    const res = await request(app)
      .post('/api/v1/schools')
      .send({
        municipio: 'Guadalajara',
        escuela: 'Escuela Nueva',
        nivel_educativo: 'Primaria',
      });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('returns 401 with a malformed Bearer token', async () => {
    const res = await request(app)
      .post('/api/v1/schools')
      .set('Authorization', 'Bearer token_invalido')
      .send({ municipio: 'GDL', escuela: 'Test', nivel_educativo: 'Primaria' });
    expect(res.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// PUT /api/v1/schools/:id — requires auth
// ---------------------------------------------------------------------------
describe('PUT /api/v1/schools/:id', () => {
  it('returns 401 without a token', async () => {
    const res = await request(app).put('/api/v1/schools/1').send({ escuela: 'Nuevo nombre' });
    expect(res.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// DELETE /api/v1/schools/:id — requires auth
// ---------------------------------------------------------------------------
describe('DELETE /api/v1/schools/:id', () => {
  it('returns 401 without a token', async () => {
    const res = await request(app).delete('/api/v1/schools/1');
    expect(res.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// POST /api/v1/schools/:id/needs — requires auth
// ---------------------------------------------------------------------------
describe('POST /api/v1/schools/:id/needs', () => {
  it('returns 401 without a token', async () => {
    const res = await request(app)
      .post('/api/v1/schools/1/needs')
      .send({ propuesta: 'Pintura', categoria: 'Infraestructura' });
    expect(res.status).toBe(401);
  });
});

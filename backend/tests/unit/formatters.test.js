'use strict';

require('../setup');

const { successResponse, errorResponse, paginatedResponse } = require('../../src/utils/formatters');

// Minimal mock for Express res object
function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
}

// ---------------------------------------------------------------------------
// successResponse
// ---------------------------------------------------------------------------
describe('successResponse', () => {
  it('returns 200 with success:true and the provided data', () => {
    const res = mockRes();
    successResponse(res, { id: 1 }, 'OK');
    expect(res.status).toHaveBeenCalledWith(200);
    const body = res.json.mock.calls[0][0];
    expect(body.success).toBe(true);
    expect(body.data).toEqual({ id: 1 });
    expect(body.message).toBe('OK');
  });

  it('uses a custom status code when provided', () => {
    const res = mockRes();
    successResponse(res, {}, 'Creado', 201);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('includes version field in every response', () => {
    const res = mockRes();
    successResponse(res, null, 'msg');
    const body = res.json.mock.calls[0][0];
    expect(body.version).toBe('v1');
  });

  it('includes a ISO timestamp', () => {
    const res = mockRes();
    successResponse(res, null, 'msg');
    const body = res.json.mock.calls[0][0];
    expect(body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('spreads extra fields into the response body', () => {
    const res = mockRes();
    successResponse(res, [], 'msg', 200, { total: 42 });
    const body = res.json.mock.calls[0][0];
    expect(body.total).toBe(42);
  });
});

// ---------------------------------------------------------------------------
// errorResponse
// ---------------------------------------------------------------------------
describe('errorResponse', () => {
  it('returns 400 with success:false by default', () => {
    const res = mockRes();
    errorResponse(res, 'Error de validación');
    expect(res.status).toHaveBeenCalledWith(400);
    const body = res.json.mock.calls[0][0];
    expect(body.success).toBe(false);
    expect(body.message).toBe('Error de validación');
  });

  it('uses a custom status code (e.g. 404)', () => {
    const res = mockRes();
    errorResponse(res, 'No encontrado', [], 404);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('includes an errors array', () => {
    const res = mockRes();
    errorResponse(res, 'Bad', [{ field: 'email', msg: 'Inválido' }], 400);
    const body = res.json.mock.calls[0][0];
    expect(Array.isArray(body.errors)).toBe(true);
    expect(body.errors[0].field).toBe('email');
  });
});

// ---------------------------------------------------------------------------
// paginatedResponse
// ---------------------------------------------------------------------------
describe('paginatedResponse', () => {
  it('includes a pagination object in the response', () => {
    const res = mockRes();
    const pagination = { limit: 10, offset: 0, total: 30, pages: 3 };
    paginatedResponse(res, [1, 2, 3], pagination, 'Lista');
    const body = res.json.mock.calls[0][0];
    expect(body.success).toBe(true);
    expect(body.pagination).toEqual(pagination);
    expect(body.data).toEqual([1, 2, 3]);
  });

  it('defaults to 200 status code', () => {
    const res = mockRes();
    paginatedResponse(res, [], { limit: 10, offset: 0, total: 0, pages: 0 }, 'msg');
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

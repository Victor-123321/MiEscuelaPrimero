'use strict';

require('../setup');

const {
  loginSchema,
  schoolNeedSchema,
  statUpdateSchema,
  footerUpdateSchema,
  paginationSchema,
} = require('../../src/utils/validators');

// ---------------------------------------------------------------------------
// loginSchema
// ---------------------------------------------------------------------------
describe('loginSchema', () => {
  it('accepts a valid email + password', () => {
    const { error } = loginSchema.validate({ email: 'admin@mpj.org.mx', password: 'Admin123!' });
    expect(error).toBeUndefined();
  });

  it('rejects a missing email', () => {
    const { error } = loginSchema.validate({ password: 'Admin123!' });
    expect(error).toBeDefined();
    expect(error.details[0].path).toContain('email');
  });

  it('rejects a malformed email', () => {
    const { error } = loginSchema.validate({ email: 'not-an-email', password: 'Admin123!' });
    expect(error).toBeDefined();
  });

  it('rejects a password shorter than 8 chars', () => {
    const { error } = loginSchema.validate({ email: 'a@b.com', password: 'short' });
    expect(error).toBeDefined();
    expect(error.details[0].path).toContain('password');
  });

  it('rejects a missing password', () => {
    const { error } = loginSchema.validate({ email: 'a@b.com' });
    expect(error).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// schoolNeedSchema
// ---------------------------------------------------------------------------
describe('schoolNeedSchema', () => {
  it('accepts a full valid need', () => {
    const { error } = schoolNeedSchema.validate({
      categoria:    'Material',
      subcategoria: 'Útiles escolares',
      propuesta:    'Mochilas para primer grado',
      cantidad:     30,
      unidad:       'piezas',
      estado:       'Aun no cubierto',
      detalles:     'Urgente para inicio de ciclo',
    });
    expect(error).toBeUndefined();
  });

  it('accepts an empty object (all fields optional)', () => {
    const { error } = schoolNeedSchema.validate({});
    expect(error).toBeUndefined();
  });

  it('accepts null cantidad (uncounted needs)', () => {
    const { error } = schoolNeedSchema.validate({ propuesta: 'Pintura exterior', cantidad: null });
    expect(error).toBeUndefined();
  });

  it('rejects negative cantidad', () => {
    const { error } = schoolNeedSchema.validate({ cantidad: -5 });
    expect(error).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// statUpdateSchema
// ---------------------------------------------------------------------------
describe('statUpdateSchema', () => {
  it('accepts a valid stat update', () => {
    const { error } = statUpdateSchema.validate({ stat_value: '1,234', stat_label: 'Escuelas apoyadas' });
    expect(error).toBeUndefined();
  });

  it('requires stat_value', () => {
    const { error } = statUpdateSchema.validate({ stat_label: 'Escuelas' });
    expect(error).toBeDefined();
    expect(error.details[0].path).toContain('stat_value');
  });

  it('accepts stat_value without optional fields', () => {
    const { error } = statUpdateSchema.validate({ stat_value: '42' });
    expect(error).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// footerUpdateSchema
// ---------------------------------------------------------------------------
describe('footerUpdateSchema', () => {
  it('accepts a non-empty content_value', () => {
    const { error } = footerUpdateSchema.validate({ content_value: 'contacto@mpj.org.mx' });
    expect(error).toBeUndefined();
  });

  it('rejects missing content_value', () => {
    const { error } = footerUpdateSchema.validate({});
    expect(error).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// paginationSchema
// ---------------------------------------------------------------------------
describe('paginationSchema', () => {
  it('applies defaults when no params given', () => {
    const { value } = paginationSchema.validate({});
    expect(value.limit).toBe(20);
    expect(value.offset).toBe(0);
    expect(value.sort_order).toBe('desc');
  });

  it('accepts valid pagination params', () => {
    const { error } = paginationSchema.validate({ limit: '10', offset: '20', sort_order: 'asc' });
    expect(error).toBeUndefined();
  });

  it('rejects limit above 100', () => {
    const { error } = paginationSchema.validate({ limit: 200 });
    expect(error).toBeDefined();
  });

  it('rejects invalid sort_order', () => {
    const { error } = paginationSchema.validate({ sort_order: 'random' });
    expect(error).toBeDefined();
  });

  it('rejects invalid urgent value', () => {
    const { error } = paginationSchema.validate({ urgent: 'yes' });
    expect(error).toBeDefined();
  });

  it('accepts valid urgent values', () => {
    ['true', 'false', '0', '1'].forEach(val => {
      const { error } = paginationSchema.validate({ urgent: val });
      expect(error).toBeUndefined();
    });
  });
});

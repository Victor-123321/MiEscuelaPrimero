'use strict';

require('../setup');

const { buildPagination, parseBooleanFilter, sanitizeString } = require('../../src/utils/helpers');

describe('buildPagination', () => {
  it('computes pages correctly', () => {
    const p = buildPagination(10, 0, 95);
    expect(p.pages).toBe(10);
    expect(p.limit).toBe(10);
    expect(p.total).toBe(95);
  });

  it('caps limit at 100', () => {
    const p = buildPagination(500, 0, 1000);
    expect(p.limit).toBe(100);
  });
});

describe('parseBooleanFilter', () => {
  it('converts "true" to 1', () => expect(parseBooleanFilter('true')).toBe(1));
  it('converts "false" to 0', () => expect(parseBooleanFilter('false')).toBe(0));
  it('converts "1" to 1', () => expect(parseBooleanFilter('1')).toBe(1));
  it('returns null for undefined input', () => expect(parseBooleanFilter(undefined)).toBeNull());
});

describe('sanitizeString', () => {
  it('strips angle brackets', () => {
    expect(sanitizeString('<script>alert(1)</script>')).toBe('scriptalert(1)/script');
  });
  it('trims whitespace', () => {
    expect(sanitizeString('  hello  ')).toBe('hello');
  });
});

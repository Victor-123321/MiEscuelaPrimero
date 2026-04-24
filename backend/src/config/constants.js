'use strict';

const BRAND_COLORS = {
  green: '#009933',
  blue: '#1C3661',
  orange: '#EC671B',
  yellow: '#F4981C',
  black: '#000000',
  white: '#FFFFFF',
};

const STATUS_COLORS = {
  success: BRAND_COLORS.green,
  info: BRAND_COLORS.blue,
  warning: BRAND_COLORS.orange,
  caution: BRAND_COLORS.yellow,
  error: BRAND_COLORS.black,
};

const SCHOOL_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

const NEED_STATUS = {
  OPEN: 'open',
  FUNDED: 'funded',
  IN_PROGRESS: 'in-progress',
};

const UPLOAD_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

const ADMIN_ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
};

const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  DEFAULT_OFFSET: 0,
};

const UPLOAD_FORMAT = {
  type: 'xlsx',
  sheets: {
    necesidades: { name: 'Necesidades', columns: ['Municipio', 'Escuela', 'Categoría', 'Subcategoría', 'Propuesta', 'Cantidad', 'Unidad', 'Estado', 'Detalles'] },
    escuelas: { name: 'Datos de las escuelas', columns: ['Municipio', 'Plantel', 'Escuela', 'Personal escolar', 'Estudiantes', 'Nivel ed.', 'CCT', 'Modalidad', 'Turno', 'Sostenimiento', 'Dirección', 'Ubicación'] },
  },
};

const UPLOAD_COLUMNS = UPLOAD_FORMAT.sheets.necesidades.columns;

module.exports = {
  BRAND_COLORS,
  STATUS_COLORS,
  SCHOOL_STATUS,
  NEED_STATUS,
  UPLOAD_STATUS,
  ADMIN_ROLES,
  PAGINATION,
  UPLOAD_FORMAT,
  UPLOAD_COLUMNS,
};

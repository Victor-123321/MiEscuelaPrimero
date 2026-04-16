'use strict';

module.exports = {
  AUTH: {
    INVALID_CREDENTIALS: 'Correo o contraseña incorrectos. Verifica tus datos e intenta de nuevo.',
    TOKEN_REQUIRED: 'Se requiere autenticación para acceder a este recurso.',
    TOKEN_INVALID: 'El token de autenticación es inválido o ha expirado.',
    FORBIDDEN: 'No tienes permisos para realizar esta acción.',
    ACCOUNT_INACTIVE: 'Tu cuenta está inactiva. Contacta al administrador.',
  },
  SCHOOL: {
    NOT_FOUND: 'La escuela no fue encontrada.',
    DUPLICATE_NAME: 'Ya existe una escuela con este nombre en el municipio.',
  },
  NEED: {
    NOT_FOUND: 'La necesidad especificada no fue encontrada.',
  },
  STAT: {
    NOT_FOUND: 'El indicador especificado no fue encontrado.',
  },
  FOOTER: {
    NOT_FOUND: 'El contenido de pie de página no fue encontrado.',
  },
  UPLOAD: {
    NO_FILE: 'No se recibió ningún archivo. Adjunta un archivo CSV o XLSX.',
    INVALID_FORMAT: 'Formato de archivo no válido. Solo se aceptan archivos .csv o .xlsx.',
    MISSING_COLUMNS: (cols) => `Columnas requeridas faltantes: ${cols.join(', ')}`,
    PROCESSING_ERROR: 'Ocurrió un error al procesar el archivo. Verifica el formato e intenta de nuevo.',
  },
  VALIDATION: {
    FAILED: 'Los datos enviados no son válidos. Revisa los errores indicados.',
  },
  GENERIC: {
    INTERNAL_ERROR: 'Ocurrió un error interno. Por favor, intenta de nuevo más tarde.',
    NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  },
};

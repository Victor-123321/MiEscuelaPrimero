'use strict';

const Joi = require('joi');

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'El correo electrónico no tiene un formato válido.',
    'any.required': 'El correo electrónico es requerido.',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'La contraseña debe tener al menos 8 caracteres.',
    'any.required': 'La contraseña es requerida.',
  }),
});

const schoolSchema = Joi.object({
  name: Joi.string().max(255).required(),
  municipality: Joi.string().max(100).required(),
  category: Joi.string().max(100).optional().allow(''),
  type: Joi.string().max(100).optional().allow(''),
  description: Joi.string().optional().allow(''),
  students: Joi.number().integer().min(0).optional(),
  teachers: Joi.number().integer().min(0).optional(),
  funding_pct: Joi.number().min(0).max(100).optional(),
  urgent: Joi.boolean().optional(),
  status: Joi.string().valid('active', 'inactive').optional(),
  school_image_url: Joi.string().uri().optional().allow(''),
});

const schoolNeedSchema = Joi.object({
  categoria:    Joi.string().max(100).optional().allow(''),
  subcategoria: Joi.string().max(150).optional().allow(''),
  propuesta:    Joi.string().max(500).optional().allow(''),
  cantidad:     Joi.number().min(0).optional().allow(null),
  unidad:       Joi.string().max(80).optional().allow(''),
  estado:       Joi.string().max(60).optional().allow(''),
  detalles:     Joi.string().optional().allow(''),
});

const statUpdateSchema = Joi.object({
  stat_value: Joi.string().max(500).required(),
  stat_label: Joi.string().max(255).optional(),
  display_order: Joi.number().integer().optional(),
});

const footerUpdateSchema = Joi.object({
  content_value: Joi.string().required(),
});

const paginationSchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(20),
  offset: Joi.number().integer().min(0).default(0),
  sort_by: Joi.string().optional(),
  sort_order: Joi.string().valid('asc', 'desc').default('desc'),
  search: Joi.string().optional().allow(''),
  municipality: Joi.string().optional().allow(''),
  category: Joi.string().optional().allow(''),
  type: Joi.string().optional().allow(''),
  urgent: Joi.string().valid('true', 'false', '0', '1').optional(),
}).unknown(true);

module.exports = {
  loginSchema,
  schoolSchema,
  schoolNeedSchema,
  statUpdateSchema,
  footerUpdateSchema,
  paginationSchema,
};

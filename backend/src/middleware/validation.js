'use strict';

const { ValidationError } = require('./errorHandler');

function validate(schema, target = 'body') {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req[target], { abortEarly: false, allowUnknown: false });
    if (error) {
      const errors = error.details.map((d) => ({
        field: d.path.join('.'),
        message: d.message,
      }));
      return next(new ValidationError(errors));
    }
    req[target] = value;
    return next();
  };
}

function validateQuery(schema) {
  return validate(schema, 'query');
}

module.exports = { validate, validateQuery };

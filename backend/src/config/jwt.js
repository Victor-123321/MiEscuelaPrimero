'use strict';

const config = require('./environment');

module.exports = {
  secret: config.jwt.secret,
  signOptions: {
    algorithm: 'HS256',
    expiresIn: config.jwt.expiration,
  },
  refreshOptions: {
    algorithm: 'HS256',
    expiresIn: config.jwt.refreshExpiration,
  },
};

'use strict';

const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

function signToken(payload) {
  return jwt.sign(payload, jwtConfig.secret, jwtConfig.signOptions);
}

function signRefreshToken(payload) {
  return jwt.sign(payload, jwtConfig.secret, jwtConfig.refreshOptions);
}

function verifyToken(token) {
  return jwt.verify(token, jwtConfig.secret);
}

module.exports = { signToken, signRefreshToken, verifyToken };

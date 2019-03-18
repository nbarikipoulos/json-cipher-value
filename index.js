/*! Copyright (c) 2019 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const CryptObject = require('./lib/cryptObjects').CryptObject;

module.exports = (secret, options) => new CryptObject(secret, options);
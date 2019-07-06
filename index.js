/*! Copyright (c) 2019 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

/**
 * 
 * This module is a simple encrypting and decrypting module
 * based on the build-in [crypto]{@link https://nodejs.org/api/crypto.html} node module. It performs 
 * **recursive** encrypting of object values remaining their types.
 * 
 * It is mainly based on the [crypto.createcipheriv]{@link https://nodejs.org/api/crypto.html#crypto_crypto_createcipheriv_algorithm_key_iv_options}
 * function and corrolary to the [crypto.createdecipheriv]{@link https://nodejs.org/api/crypto.html#crypto_crypto_createdecipheriv_algorithm_key_iv_options}
 * one using a randomly generated initalization vector.
 * 
 * The entry point is the [cipher object factory]{@link module:json-cipher-value~factory} that creates
 * a (un)ciphering object.
 * 
 * Note default settings are performing an aes-256-crt ciphering.
 * 
 * @module json-cipher-value
 * @version 1.1.1
 * @see {@link https://nodejs.org/api/crypto.html} for further information.
 */

'use strict'

const CryptObject = require('./lib/cryptObjects').CryptObject;

/**
 * Factory that creates a (un)ciphering object.
 * 
 * @param {string} secret - The secret key or pawssord that will be used to create the
 *  key for (un)ciphering step.
 * @param {module:cryptObjects~Options=} options - (Un)Ciphering Settings. 
 *  Use of default settings performs an aes-256-crt ciphering.
 * @type {module:cryptObjects~CryptObject}
 * 
 * @memberof module:json-cipher-value
 * @alias module:json-cipher-value
 * @example
 * const createCryptObject = require('json-cipher-value');
 * 
 * let secret = 'My secret password';
 * let object = {...}; // Object to cipher
 *
 * let cryptObject = createCryptObject(secret);
 *
 * let encryptedObject = cryptObject.encrypt(object);
 * 
 * let decryptedObject = cryptObject.decrypt(encryptedObject);
 */
let factory = (secret, options) => new CryptObject(secret, options);

/////////////////////////
/////////////////////////
// Public API
/////////////////////////
/////////////////////////

module.exports = factory;
/*! Copyright (c) 2019-2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

/**
 *
 * This module is a simple (de)ciphering module based on the build-in
 * [crypto]{@link https://nodejs.org/api/crypto.html} node module. It performs
 * **recursive** (de)ciphering of the values of an object retaining their types.
 *
 * It is mainly based on the [crypto.createcipheriv]{@link https://nodejs.org/api/crypto.html#crypto_crypto_createcipheriv_algorithm_key_iv_options}
 * function and corrolary to the [crypto.createdecipheriv]{@link https://nodejs.org/api/crypto.html#crypto_crypto_createdecipheriv_algorithm_key_iv_options}
 * one using a randomly generated initalization vector.
 *
 * The entry point is the [cipher object factory]{@link module:json-cipher-value~factory} that creates
 * a (de)ciphering object.
 *
 * Note default settings use aes-256-crt ciphering.
 *
 * @module json-cipher-value
 * @version 1.2.0
 * @see {@link https://nodejs.org/api/crypto.html} for further information.
 */

'use strict'

const { CipherObject } = require('./lib/cipherObjects')

/**
 * Factory that creates a (de)ciphering object.
 *
 * @param {string} secret - The secret key or pawssord that will be used to create the
 *  key for (de)ciphering step.
 * @param {module:cipherObjects~Options=} options - (De)Ciphering Settings.
 *  Use of default settings performs an aes-256-crt ciphering.
 * @type {module:cipherObjects~CipherObject}
 *
 * @memberof module:json-cipher-value
 * @alias module:json-cipher-value
 * @example
 * const createCipherObject = require('json-cipher-value')
 *
 * const secret = 'My secret password'
 * let object = {...} // Object to cipher
 *
 * let cipherObject = createCipherObject(secret)
 *
 * let cipheredObject = cipherObject.encrypt(object)
 *
 * let decipheredObject = cipherObject.decrypt(cipheredObject)
 */
const factory = (secret, options) => new CipherObject(secret, options)

// //////////////////////
// //////////////////////
// Public API
// //////////////////////
// //////////////////////

module.exports = factory

/**
 * This module is a simple (de)ciphering module based on the build-in
 * [crypto]{@link https://nodejs.org/api/crypto.html} node module. It performs
 * **recursive** (de)ciphering of the values of an object remaining their types.
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
 * @version 2.0.3
 * @see {@link https://nodejs.org/api/crypto.html} for further information.
 */
import { CipherObject } from '#lib'

/**
 * Settings for (de)ciphering.
 *
 * @typedef Options
 * @type Object
 * @property {string} [algo=aes-256-crt] - the algorithm to use.
 * @property {int} [ivLength=16] - its initialization vector length.
 * @memberof module:json-cipher-value
 * @inner
 * @category Typedefs
 * @see {@link https://nodejs.org/api/crypto.html} for further information; in particular about
 * available algorithms and theirs iv lengths.
 */

/**
 * Factory that creates a (de)ciphering object.
 *
 * @param {string} secret - The secret key or pawssord that will be used to create the
 *  key for (de)ciphering step.
 * @param {module:json-cipher-value~Options=} options - (De)Ciphering Settings.
 *  Use of default settings performs an aes-256-crt ciphering.
 * @memberof module:json-cipher-value
 * @type {module:json-cipher-value~CipherObject}
 * @example
 * import createCipherObject form 'json-cipher-value'
 *
 * const secret = 'My secret password'
 * const object = {...} // Object to cipher
 *
 * const cipherObject = createCipherObject(secret)
 *
 * const cipheredObject = cipherObject.perform('cipher', object)
 *
 * const decipheredObject = cipherObject.perform('decipher', cipheredObject)
 */
const factory = (secret, options) => new CipherObject(secret, options)

export {
  factory as default,
  CipherObject
}

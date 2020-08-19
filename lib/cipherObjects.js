/*! Copyright (c) 2019-2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

/**
 * Internal module objects of interest.
 * @module cipherObjects
 */

'use strict'

/**
 * Settings for CipherObjects.
 *
 * @typedef Options
 * @type Object
 * @property {string} [algo=aes-256-crt] - the algorithm to use.
 * @property {int} [ivLength=16] - its initialization vector length.
 * @memberof module:cipherObjects
 * @inner
 * @category Typedefs
 * @see {@link https://nodejs.org/api/crypto.html} for further information; in particular about
 * available algorithms and theirs iv lengths.
 */

const crypto = require('crypto')

const tr = require('./tr')

/**
 * Intermediate object that handles (de)ciphering of primitive type.
 *
 * @memberof module:cipherObjects
 * @inner
 */
class CipherData {
  /**
   * Create a new CipherData object.
   *
   * @param {string} secret - The secret key or password that will be used to create the
   *  key for (de)ciphering step.
   * @param {module:cipherObjects~Options=} options - (De)Ciphering Settings.
   *  Note Use of default settings performs an aes-256-crt ciphering.
   */
  constructor (secret, {
    algo = 'aes-256-ctr',
    ivLength = 16
  } = {}) {
    this._encryptionKey = Buffer.from(
      crypto.createHash('sha256')
        .update(String(secret))
        .digest()
    )

    this._algo = algo
    this._ivLength = ivLength
  }

  /**
   * Cipher a primitive type value.
   *
   * For each call, an iv vector is randomly generated.
   *
   * Note the retained type are number, boolean, or string. All other kind of values
   * will be treated as string.
   * @param {string|number|boolean|*} value - value to cipher.
   * @type {string}
   */
  encryptd (value) {
    const iv = crypto.randomBytes(this._ivLength)

    const cipher = crypto.createCipheriv(
      this._algo,
      this._encryptionKey,
      iv
    )

    const ciphertext = Buffer.concat([
      cipher.update(TYPE[typeof value]),
      cipher.update(String(value)),
      cipher.final()
    ])

    return iv.toString('hex') +
      ciphertext.toString('hex')
  }

  /**
   * Uncipher value.
   * @param {string} value - value to uncipher.
   * @type {string|number|boolean}
   */
  decryptd (value) {
    const strValue = String(value)

    let idx = 2 * this._ivLength

    const iv = Buffer.from(
      strValue.slice(0, idx),
      'hex'
    )

    const ciphertext = Buffer.from(
      strValue.slice(idx),
      'hex'
    )

    const decipher = crypto.createDecipheriv(
      this._algo,
      this._encryptionKey,
      iv
    )

    const decipheredValue = decipher.update(ciphertext, 'hex', 'utf8') +
      decipher.final('utf8')

    idx = 0

    const type = decipheredValue[idx++]

    return toType(
      type,
      decipheredValue.substring(idx)
    )
  }
}

/**
 * Object in charge to (de)cipher values of object.
 *
 * @extends module:cipherObjects~CipherData
 * @memberof module:cipherObjects
 * @inner
 */
class CipherObject extends CipherData {
  /**
   * Cipher object. It returns a clone of the object with ciphered values.
   *
   * @param {Object} object - Object to cipher.
   * @type {Object}
   */
  encrypt (object) {
    return tr(object, v => this.encryptd(v))
  }

  /**
   * Uncipher object. It returns a clone of the input object applying unciphering of its values.
   *
   * @param {Object} object - Object to uncipher.
   * @type {Object}
   */
  decrypt (object) {
    return tr(object, v => this.decryptd(v))
  }
}

// ///////////////////////////////
// Utility functions
// ///////////////////////////////

const toType = (type, data) => {
  let res
  switch (type) {
    case 'n':
      res = Number(data)
      break
    case 'b':
      res = data === 'true'
      break
    case 's':
    default:
      res = data
  }

  return res
}

const TYPE = {
  string: 's',
  number: 'n',
  boolean: 'b'
}

// //////////////////////
// //////////////////////
// Public API
// //////////////////////
// //////////////////////

module.exports = { CipherData, CipherObject }

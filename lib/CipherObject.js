/*! Copyright (c) 2019-2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */
'use strict'

const crypto = require('crypto')

const tr = require('./tr')

/**
 * Object in charge to cipher both supported primitive type or values of object.
 *
 * @memberof module:json-cipher-value
 * @inner
 */
class CipherObject {
  /**
   * Create a new Cipher object.
   *
   * @param {string} secret - The secret key or password that will be used to create
   *  key for (de)ciphering step.
   * @param {module:json-cipher-value~Options=} options - (De)Ciphering Settings.
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
   * (De)Cipher content.
   *
   * Note about Ciphering case:
   *   - Supported input are **number**, **boolean**, **string** or **object** (including **array**).
   *     All other kind of values will be treated as string.
   *   - An iv vector is randomly generated at each ciphering of values
   *     _i.e._ for each object properties with a primitive type as value.
   *   - The return value concatenates the iv vector and the ciphertext.
   * @param {'cipher'|'decipher'} action - action to perform.
   * @param {*} value - Input to (de)cipher.
   * @type {*}
   */

  perform (action, object) {
    let result
    switch (action) {
      case 'cipher':
      case 'encrypt':
        result = tr(object, (v) => this.cipher(v))
        break
      case 'decipher':
      case 'decrypt':
        result = tr(object, (v) => this.decipher(v))
    }
    return result
  }

  /**
   * Cipher a primitive type.
   *
   * At each call, an iv vector is randomly generated.
   *
   * Supported type are **number**, **boolean**, or **string**. All other kind of values
   * will be treated as a string.
   * @param {string|number|boolean|*} value - value to cipher.
   * @type {string}
   */
  cipher (value) {
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
   * Uncipher primitive type.
   * @param {string} cipheredText - ciphered data
   * @type {string|number|boolean}
   */
  decipher (cipheredText) {
    const v = String(cipheredText)

    let idx = 2 * this._ivLength

    const [iv, ciphertext] = [v.slice(0, idx), v.slice(idx)]
      .map(str => Buffer.from(str, 'hex'))

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

module.exports = CipherObject

/*! Copyright (c) 2019 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

/**
 * Internal module objects of interest.
 * @module cryptObjects
 */

'use strict'

/**
 * (Un)cipher object settings.
 * 
 * Note **next to ciphering process, unciphering must be performed with the same options values**.
 * 
 * @typedef Options
 * @type Object
 * @property {string} [algo=aes-256-crt] - the algorithm to use.
 * @property {int} [ivLength=16] - its initialization vector length.
 * @property {boolean} [isTyped=true] - if true, the type of values should be retained. 
 *  Otherwise values will be ciphered as string.
 * @memberof module:cryptObjects
 * @inner
 * @category Typedefs
 * @see {@link https://nodejs.org/api/crypto.html} for further information; in particular about
 * available algorithms and theirs iv lengths.
 */

const crypto = require('crypto');

const tr = require('./tr');

/**
 * Object in charge to (un)cipher js object values.
 * 
 * @extends module:cryptObjects~CryptData
 * @memberof module:cryptObjects
 * @inner
 */
class CryptObject extends CryptData {

  /**
   * Create a new CryptData object using specifed options.
   * 
   * @param {string} secret - The secret key or password that will be used to create the
   *  key for (un)ciphering step.
   * @param {module:cryptObjects~Options=} options - (Un)Ciphering Settings. 
   *  Use of default settings performs an aes-256-crt ciphering.
  */
  constructor(secret, options) {
     super(secret, options);
  }

  /**
   * Cipher object. It returns a copy of the object containing with its values ciphered.
   * 
   * @param {object} object - Object to cipher.
   * @type {object}
   */
  encrypt(object) {
    return tr(object, v => this.encryptd(v) );
  }

  /**
   * Uncipher object. It returns a copy of the ciphered object with unciphered values.
   * 
   * Note this unciphering step must be done using the same settings as for ciphering.
   * 
   * @param {object} object - Ciphered object to uncipher.
   * @type {object}
   */
  decrypt(object) {
    return tr(object, v => this.decryptd(v) )
  }
  
}

/**
 * Intermediate object that handles single data (un)ciphering.
 * 
 * @memberof module:cryptObjects
 * @inner
 */
class CryptData {

  /**
   * Create a new CryptData object using specifed options.
   * 
   * @param {string} secret - The secret key or password that will be used to create the
   *  key for (un)ciphering step.
   * @param {module:cryptObjects~Options=} options - (Un)Ciphering Settings. 
   *  Use of default settings performs an aes-256-crt ciphering.
   */
  constructor(secret, {
    algo = 'aes-256-ctr',
    ivLength = 16,
    isTyped = true
  } = {}) {

    this._encryptionKey = Buffer.from(
      crypto.createHash('sha256')
        .update(String(secret))
        .digest()
    );

    this._isTyped = isTyped;

    this._algo = algo;
    this._ivLength = ivLength

  }

  /**
   * Cipher a given data.
   * 
   * For each call, an iv vector will be randomly generated.
   * 
   * Note retained type are integer, boolean, or string. All other kind of values
   * will be treated as string.
   * @param {string|integer|boolean|*} data - Data to cipher.
   * @type {string}
   */
  encryptd(data) {

    const iv = crypto.randomBytes(this._ivLength);

    let cipher = crypto.createCipheriv(
      this._algo,
      this._encryptionKey,
      iv
    );
  
    let encrypted = Buffer.concat([
      cipher.update(
        (this._isTyped
          ? TYPE[typeof data] 
          : ''
        )
      ),
      cipher.update(
        String(data)
      ),
      cipher.final()
    ]);
  
    return iv.toString('hex')
      + encrypted.toString('hex')
    ;
  }

  /**
   * Uncipher data.
   * 
   * For this step, note the CryptData object **must be initialized with the same options as for the ciphering** step.
   * @param {string} data - Data to uncipher.
   * @type {string|integer|boolean}
   */
  decryptd(data) {

    const value = String(data);

    let idx = 2*this._ivLength;

    let iv = Buffer.from(
      value.slice(0, idx),
      'hex'
    );

    let encryptedData = Buffer.from(
      value.slice(idx),
      'hex'
    );

    let decipher = crypto.createDecipheriv(
      this._algo,
      this._encryptionKey,
      iv
    );

    let decryptedData = decipher.update(encryptedData, 'hex', 'utf8')
      + decipher.final('utf8')

    idx = 0;

    let type = this._isTyped
      ? decryptedData[idx++]
      : 's'
    ;

    return toType(
      type, 
      decryptedData.substring(idx)
    );  
  }
}

//////////////////////////////////
// Utility functions
//////////////////////////////////

const toType = (type, data) => {
  let res;
  switch(type) {
    case 'n':
      res = Number(data);
      break;
    case 'b': 
      res = 'true' === data;
      break;
    case 's':
    default:
      res = data;
  }

  return res;
}

const TYPE = {
  string: 's',
  number: 'n',
  boolean: 'b'
}

/////////////////////////
/////////////////////////
// Public API
/////////////////////////
/////////////////////////

module.exports = {CryptData, CryptObject};
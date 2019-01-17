/*!
 * (The MIT License)
 *
 * Copyright (c) 2019 N. Barikipoulos <nikolaos.barikipoulos@outlook.fr>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
'use strict'

const crypto = require('crypto');

const tr = require('./tr');

class CryptData {

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

  encryptd(data) {

    const iv = crypto.randomBytes(this._ivLength);

    let cipher = crypto.createCipheriv(
      this._algo,
      this._encryptionKey,
      iv
    );
  
    let encrypted = Buffer.concat([
      cipher.update(String(data)),
      cipher.final()
    ]);
  
    return iv.toString('hex')
      + (this._isTyped
        ? TYPE[typeof data] 
        : ''
      )
      + encrypted.toString('hex')
    ;
  }

  decryptd(data) {

    const value = String(data);

    let iv = Buffer.from(
      value.slice(0, 2*this._ivLength),
      'hex'
    );

    let idx = 2*this._ivLength;
    let type = this._isTyped
      ? data[idx++]
      : 's'
    ;

    let encryptedText = Buffer.from(
      value.slice(idx),
      'hex'
    );

    let decipher = crypto.createDecipheriv(
      this._algo,
      this._encryptionKey,
      iv
    );

    return toType(
      type, 
      decipher.update(encryptedText, 'hex', 'utf8')
        + decipher.final('utf8')
    );  
  }

}

class CryptObject extends CryptData {
   
  constructor(secret, options) {
     super(secret, options);
  }

  encrypt(object) {
    return tr(object, v => this.encryptd(v) );
  }

  decrypt(object) {
    return tr(object, v => this.decryptd(v) )
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
/*! Copyright (c) 2019 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

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
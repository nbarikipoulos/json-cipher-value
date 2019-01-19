# JSON Cipher Value
[![NPM version][npm-image]][npm-url]

json-cipher-value is a simple encrypting and decrypting module for node.js that performs recursive encryption of object values and retains their types.

Note:
- This module is based on the build-in crypto node module,
- Default settings perform an aes-256-ctr ciphering,
- An iv is randomly generated for each value and appended to the result.

## Install

```shell
npm install json-cipher-value --save
```

## Usage

```js

  const createCryptObject = require('json-cipher-value');

  let secret = 'My secret password';
  let cryptObject = createCryptObject(secret);

  let object = {
    a: 'a value',
    b: {
      a: [1, 3.1, '2.2', true, true, false]
    }
  };

  let encryptedObject = cryptObject.encrypt(object);
  //{
  //  a: '35747569f964d575521a0205b8d21af8eab60b69c30d2fe5',
  //  b: {
  //    a: [
  //        '7f7e507e96b07807661d6e531f6b4e489205',
  //        'a6af3a7c1d52a8163a196c4487256c584a0943e9',
  //        'eed2d3bf77a9d0fa51449268dc6c1553fd6257ba',
  //        'bf0fca31bf46d5611899cf9e53f49f28d317bebcf8',
  //        '10c58a69fd3bcf904cf5860e423d081cf6d2646227',
  //        'dda317d5e23e5f14423c44ee46b9bf49c762ee23ed49' 
  //    ]
  //  }
  //}

  let decryptedObject = cryptObject.decrypt(encryptedObject)
  // { a: 'a value', b: { a: [ 1, 3.1, '2.2', true, true, false ] } }
```

## Credits

- Nikolaos Barikipoulos ([nbarikipoulos](https://github.com/nbarikipoulos))

## License

This module is MIT licensed. See [LICENSE](./LICENSE.md).

[npm-url]: https://www.npmjs.com/package/json-cipher-value
[npm-image]: https://img.shields.io/npm/v/json-cipher-value.svg
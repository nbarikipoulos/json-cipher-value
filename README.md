# cipher-json

cipher-json is a simple encrypt and decrypt module for node.js that performs recursive encryption of object values and retains their types.

Note:
- Default settings perform an aes-256-ctr ciphering,
- The iv is randomly generated and appended to the result.

## Install

```shell
npm install cipher-js
```

## Usage

```js

  const createCryptObject = require('cipher-json');

  let secret = 'My secret password';
  let cryptObject = createCryptObject(secret);

  let object = {
    a: 'a value',
    c: {
      a: [1, 3.1, "2.2", true, false]
    }
  };

  let encryptedObject = cryptObject.encrypt(object);
  //{
  //  a: 'd305ce990639fdd033654b5444f2b190sfb87990183274a',
  //  c: {
  //    a: [
  //        'cd743602a0151b91ef99d3ed91e497aen6c',
  //        '1aadd6df001f3bceabc642c17290099cn6d134e',
  //        '0c4c8e12851eab3e1290cda3a4ec7be6s133157',
  //        'ed453ca93ef320840ac43015283dabf3bd71a5b4a',
  //        '3c4ea6a9a7be06aaaa85d88531e07824b00c515adcc'
  //    ]
  //  }
  //}

  let decryptedObject = cryptObject.decrypt(encryptedObject)
  // { a: 'a value', c: { a: [ 1, 3.1, '2.2', true, false ] } }
```

## Credits

- Nikolaos Barikipoulos ([nbarikipoulos](https://github.com/nbarikipoulos))

## License

This module is MIT licensed. See [LICENSE](./LICENSE.md).
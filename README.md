# JSON Cipher Value

[![NPM version][npm-image]][npm-url]
[![JavaScript Style Guide][standard-image]][standard-url]
[![Maintainability][code-climate-image]][code-climate-url]

json-cipher-value is a simple (de)ciphering module for node.js that recursively performs encryption of the values of object/json files retaining their types.

Note:

- This module is based on the build-in crypto node module,
- Default settings perform an aes-256-ctr ciphering,
- An iv is randomly generated for each value.

Furthermore, it is provided with a [CLI](#cli) in order to simply cipher json files.

## Table of Contents

<!-- toc -->

- [Install](#install)
- [Usage](#usage)
- [CLI](#cli)
- [API](#api)
- [Tests](#tests)
- [Credits](#credits)
- [License](#license)

<!-- tocstop -->

## Install

```shell
npm install json-cipher-value
```

## Usage

```js
const createCipherObject = require('json-cipher-value')

const secret = 'My secret password'
const cipherObject = createCipherObject(secret)

const object = {
  a: 'a value',
  b: {
    a: [1, 3.1, '2.2', true, true, false]
  }
}

const cipheredObject = cipherObject.perform('cipher', object)
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

const decipheredObject = cipherObject.perform('decipher', cipheredObject)
// { a: 'a value', b: { a: [ 1, 3.1, '2.2', true, true, false ] } }
```

## CLI
  This module is provided with a CLI in order to simply cipher json files:
  - It performs (de)ciphering with the default algorithm used by this package _i.e._ the aes-256-ctr one's,
  - It optionnally allows modifying ciphered file extension (.cjson as default) or target folder.

```shell
cipher-json cipher src/data/**/*.json 'My secret password'
cipher-json decipher src/data/**/*.cjson 'My secret password'
```
Use -h for further details/available options.

## API

See [API.md](./doc/api.md) for more details.

## Tests

Typing:

```shell
npm run test
```

will launch a set of unit and functional tests as well as checking the compliancy of code with standardjs.

## Credits

- Nicolas Barriquand ([nbarikipoulos](https://github.com/nbarikipoulos))

## License

This module is MIT licensed. See [LICENSE](./LICENSE.md).

[npm-url]: https://www.npmjs.com/package/json-cipher-value
[npm-image]: https://img.shields.io/npm/v/json-cipher-value.svg
[standard-url]: https://standardjs.com
[standard-image]: https://img.shields.io/badge/code_style-standard-brightgreen.svg
[code-climate-url]: https://codeclimate.com/github/nbarikipoulos/json-cipher-value/maintainability
[code-climate-image]: https://api.codeclimate.com/v1/badges/796eb7fd76e1ae8e24fa/maintainability
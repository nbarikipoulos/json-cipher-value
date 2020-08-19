# json-cipher-value API Reference

This module is a simple (de)ciphering module based on the build-in
[crypto](https://nodejs.org/api/crypto.html) node module. It performs
**recursive** (de)ciphering of the values of an object remaining their types.

It is mainly based on the [crypto.createcipheriv](https://nodejs.org/api/crypto.html#crypto_crypto_createcipheriv_algorithm_key_iv_options)
function and corrolary to the [crypto.createdecipheriv](https://nodejs.org/api/crypto.html#crypto_crypto_createdecipheriv_algorithm_key_iv_options)
one using a randomly generated initalization vector.

The entry point is the [cipher object factory](module:json-cipher-value~factory) that creates
a (de)ciphering object.

Note default settings use aes-256-crt ciphering.

**See**: [https://nodejs.org/api/crypto.html](https://nodejs.org/api/crypto.html) for further information.  
**Version**: 1.2.0  

* [json-cipher-value](#module_json-cipher-value)
    * _static_
        * [.factory(secret, [options])](#module_json-cipher-value.factory) : [<code>CipherObject</code>](#module_json-cipher-value..CipherObject)⏏
    * _inner_
        * [~CipherObject](#module_json-cipher-value..CipherObject)
            * [new CipherObject(secret, [options])](#new_module_json-cipher-value..CipherObject_new)
            * [.perform(action, value)](#module_json-cipher-value..CipherObject+perform) : <code>\*</code>
            * [.cipher(value)](#module_json-cipher-value..CipherObject+cipher) : <code>string</code>
            * [.decipher(cipheredText)](#module_json-cipher-value..CipherObject+decipher) : <code>string</code> \| <code>number</code> \| <code>boolean</code>
        * _Typedefs_
            * [~Options](#module_json-cipher-value..Options) : <code>Object</code>

<a name="module_json-cipher-value.factory"></a>

### json-cipher-value.factory(secret, [options]) : [<code>CipherObject</code>](#module_json-cipher-value..CipherObject)
Factory that creates a (de)ciphering object.

**Kind**: static method of [<code>json-cipher-value</code>](#module_json-cipher-value)  

| Param | Type | Description |
| --- | --- | --- |
| secret | <code>string</code> | The secret key or pawssord that will be used to create the  key for (de)ciphering step. |
| [options] | [<code>Options</code>](#module_json-cipher-value..Options) | (De)Ciphering Settings.  Use of default settings performs an aes-256-crt ciphering. |

**Example**  
```js
const createCipherObject = require('json-cipher-value')

const secret = 'My secret password'
let object = {...} // Object to cipher

let cipherObject = createCipherObject(secret)

let cipheredObject = cipherObject.perform('cipher', object)

let decipheredObject = cipherObject.perform('decipher', object)
```
<a name="module_json-cipher-value..CipherObject"></a>

### json-cipher-value~CipherObject
Object in charge to cipher both supported primitive type or values of object.

**Kind**: inner class of [<code>json-cipher-value</code>](#module_json-cipher-value)  

* [~CipherObject](#module_json-cipher-value..CipherObject)
    * [new CipherObject(secret, [options])](#new_module_json-cipher-value..CipherObject_new)
    * [.perform(action, value)](#module_json-cipher-value..CipherObject+perform) : <code>\*</code>
    * [.cipher(value)](#module_json-cipher-value..CipherObject+cipher) : <code>string</code>
    * [.decipher(cipheredText)](#module_json-cipher-value..CipherObject+decipher) : <code>string</code> \| <code>number</code> \| <code>boolean</code>

<a name="new_module_json-cipher-value..CipherObject_new"></a>

#### new CipherObject(secret, [options])
Create a new Cipher object.


| Param | Type | Description |
| --- | --- | --- |
| secret | <code>string</code> | The secret key or password that will be used to create  key for (de)ciphering step. |
| [options] | [<code>Options</code>](#module_json-cipher-value..Options) | (De)Ciphering Settings.  Note Use of default settings performs an aes-256-crt ciphering. |

<a name="module_json-cipher-value..CipherObject+perform"></a>

#### cipherObject.perform(action, value) : <code>\*</code>
(De)Cipher content.

Note about Ciphering case:
  - Supported input are **number**, **boolean**, **string** or **object** (including **array**).
    All other kind of values will be treated as string.
  - An iv vector is randomly generated at each ciphering of values
    _i.e._ for each object properties with a primitive type as value.
  - The return value concatenates the iv vector and the ciphertext.

**Kind**: instance method of [<code>CipherObject</code>](#module_json-cipher-value..CipherObject)  

| Param | Type | Description |
| --- | --- | --- |
| action | <code>&#x27;cipher&#x27;</code> \| <code>&#x27;decipher&#x27;</code> | action to perform. |
| value | <code>\*</code> | Input to (de)cipher. |

<a name="module_json-cipher-value..CipherObject+cipher"></a>

#### cipherObject.cipher(value) : <code>string</code>
Cipher a primitive type.

At each call, an iv vector is randomly generated.

Supported type are **number**, **boolean**, or **string**. All other kind of values
will be treated as a string.

**Kind**: instance method of [<code>CipherObject</code>](#module_json-cipher-value..CipherObject)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> \| <code>number</code> \| <code>boolean</code> \| <code>\*</code> | value to cipher. |

<a name="module_json-cipher-value..CipherObject+decipher"></a>

#### cipherObject.decipher(cipheredText) : <code>string</code> \| <code>number</code> \| <code>boolean</code>
Uncipher primitive type.

**Kind**: instance method of [<code>CipherObject</code>](#module_json-cipher-value..CipherObject)  

| Param | Type | Description |
| --- | --- | --- |
| cipheredText | <code>string</code> | ciphered data |

<a name="module_json-cipher-value..Options"></a>

### json-cipher-value~Options : <code>Object</code>
Settings for (de)ciphering.

**Kind**: inner typedef of [<code>json-cipher-value</code>](#module_json-cipher-value)  
**Category**: Typedefs  
**See**: [https://nodejs.org/api/crypto.html](https://nodejs.org/api/crypto.html) for further information; in particular about
available algorithms and theirs iv lengths.  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [algo] | <code>string</code> | <code>&quot;aes-256-crt&quot;</code> | the algorithm to use. |
| [ivLength] | <code>int</code> | <code>16</code> | its initialization vector length. |


# json-cipher-value API Reference

This module is a simple (de)ciphering module based on the build-in
[crypto](https://nodejs.org/api/crypto.html) node module. It performs
**recursive** (de)ciphering of the values of an object retaining their types.

It is mainly based on the [crypto.createcipheriv](https://nodejs.org/api/crypto.html#crypto_crypto_createcipheriv_algorithm_key_iv_options)
function and corrolary to the [crypto.createdecipheriv](https://nodejs.org/api/crypto.html#crypto_crypto_createdecipheriv_algorithm_key_iv_options)
one using a randomly generated initalization vector.

The entry point is the [cipher object factory](module:json-cipher-value~factory) that creates
a (de)ciphering object.

Note default settings use aes-256-crt ciphering.

**See**: [https://nodejs.org/api/crypto.html](https://nodejs.org/api/crypto.html) for further information.  
**Version**: 1.2.0  
<a name="exp_module_json-cipher-value--factory"></a>

### factory(secret, [options]) : [<code>CipherObject</code>](#module_cipherObjects..CipherObject) ⏏
Factory that creates a (de)ciphering object.

**Kind**: Exported function  

| Param | Type | Description |
| --- | --- | --- |
| secret | <code>string</code> | The secret key or pawssord that will be used to create the  key for (de)ciphering step. |
| [options] | [<code>Options</code>](#module_cipherObjects..Options) | (De)Ciphering Settings.  Use of default settings performs an aes-256-crt ciphering. |

**Example**  
```js
const createCipherObject = require('json-cipher-value')

const secret = 'My secret password'
let object = {...} // Object to cipher

let cipherObject = createCipherObject(secret)

let cipheredObject = cipherObject.encrypt(object)

let decipheredObject = cipherObject.decrypt(cipheredObject)
```

Internal module objects of interest.


* [cipherObjects](#module_cipherObjects)
    * [~CipherData](#module_cipherObjects..CipherData)
        * [new CipherData(secret, [options])](#new_module_cipherObjects..CipherData_new)
        * [.encryptd(value)](#module_cipherObjects..CipherData+encryptd) : <code>string</code>
        * [.decryptd(value)](#module_cipherObjects..CipherData+decryptd) : <code>string</code> \| <code>number</code> \| <code>boolean</code>
    * [~CipherObject](#module_cipherObjects..CipherObject) ⇐ [<code>CipherData</code>](#module_cipherObjects..CipherData)
        * [.encrypt(object)](#module_cipherObjects..CipherObject+encrypt) : <code>Object</code>
        * [.decrypt(object)](#module_cipherObjects..CipherObject+decrypt) : <code>Object</code>
        * [.encryptd(value)](#module_cipherObjects..CipherData+encryptd) : <code>string</code>
        * [.decryptd(value)](#module_cipherObjects..CipherData+decryptd) : <code>string</code> \| <code>number</code> \| <code>boolean</code>
    * _Typedefs_
        * [~Options](#module_cipherObjects..Options) : <code>Object</code>

<a name="module_cipherObjects..CipherData"></a>

### cipherObjects~CipherData
Intermediate object that handles (de)ciphering of primitive type.

**Kind**: inner class of [<code>cipherObjects</code>](#module_cipherObjects)  

* [~CipherData](#module_cipherObjects..CipherData)
    * [new CipherData(secret, [options])](#new_module_cipherObjects..CipherData_new)
    * [.encryptd(value)](#module_cipherObjects..CipherData+encryptd) : <code>string</code>
    * [.decryptd(value)](#module_cipherObjects..CipherData+decryptd) : <code>string</code> \| <code>number</code> \| <code>boolean</code>

<a name="new_module_cipherObjects..CipherData_new"></a>

#### new CipherData(secret, [options])
Create a new CipherData object.


| Param | Type | Description |
| --- | --- | --- |
| secret | <code>string</code> | The secret key or password that will be used to create the  key for (de)ciphering step. |
| [options] | [<code>Options</code>](#module_cipherObjects..Options) | (De)Ciphering Settings.  Note Use of default settings performs an aes-256-crt ciphering. |

<a name="module_cipherObjects..CipherData+encryptd"></a>

#### cipherData.encryptd(value) : <code>string</code>
Cipher a primitive type value.

For each call, an iv vector is randomly generated.

Note the retained type are number, boolean, or string. All other kind of values
will be treated as string.

**Kind**: instance method of [<code>CipherData</code>](#module_cipherObjects..CipherData)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> \| <code>number</code> \| <code>boolean</code> \| <code>\*</code> | value to cipher. |

<a name="module_cipherObjects..CipherData+decryptd"></a>

#### cipherData.decryptd(value) : <code>string</code> \| <code>number</code> \| <code>boolean</code>
Uncipher value.

**Kind**: instance method of [<code>CipherData</code>](#module_cipherObjects..CipherData)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | value to uncipher. |

<a name="module_cipherObjects..CipherObject"></a>

### cipherObjects~CipherObject ⇐ [<code>CipherData</code>](#module_cipherObjects..CipherData)
Object in charge to (de)cipher values of object.

**Kind**: inner class of [<code>cipherObjects</code>](#module_cipherObjects)  
**Extends**: [<code>CipherData</code>](#module_cipherObjects..CipherData)  

* [~CipherObject](#module_cipherObjects..CipherObject) ⇐ [<code>CipherData</code>](#module_cipherObjects..CipherData)
    * [.encrypt(object)](#module_cipherObjects..CipherObject+encrypt) : <code>Object</code>
    * [.decrypt(object)](#module_cipherObjects..CipherObject+decrypt) : <code>Object</code>
    * [.encryptd(value)](#module_cipherObjects..CipherData+encryptd) : <code>string</code>
    * [.decryptd(value)](#module_cipherObjects..CipherData+decryptd) : <code>string</code> \| <code>number</code> \| <code>boolean</code>

<a name="module_cipherObjects..CipherObject+encrypt"></a>

#### cipherObject.encrypt(object) : <code>Object</code>
Cipher object. It returns a clone of the object with ciphered values.

**Kind**: instance method of [<code>CipherObject</code>](#module_cipherObjects..CipherObject)  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | Object to cipher. |

<a name="module_cipherObjects..CipherObject+decrypt"></a>

#### cipherObject.decrypt(object) : <code>Object</code>
Uncipher object. It returns a clone of the input object applying unciphering of its values.

**Kind**: instance method of [<code>CipherObject</code>](#module_cipherObjects..CipherObject)  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | Object to uncipher. |

<a name="module_cipherObjects..CipherData+encryptd"></a>

#### cipherObject.encryptd(value) : <code>string</code>
Cipher a primitive type value.

For each call, an iv vector is randomly generated.

Note the retained type are number, boolean, or string. All other kind of values
will be treated as string.

**Kind**: instance method of [<code>CipherObject</code>](#module_cipherObjects..CipherObject)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> \| <code>number</code> \| <code>boolean</code> \| <code>\*</code> | value to cipher. |

<a name="module_cipherObjects..CipherData+decryptd"></a>

#### cipherObject.decryptd(value) : <code>string</code> \| <code>number</code> \| <code>boolean</code>
Uncipher value.

**Kind**: instance method of [<code>CipherObject</code>](#module_cipherObjects..CipherObject)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | value to uncipher. |

<a name="module_cipherObjects..Options"></a>

### cipherObjects~Options : <code>Object</code>
Settings for CipherObjects.

**Kind**: inner typedef of [<code>cipherObjects</code>](#module_cipherObjects)  
**Category**: Typedefs  
**See**: [https://nodejs.org/api/crypto.html](https://nodejs.org/api/crypto.html) for further information; in particular about
available algorithms and theirs iv lengths.  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [algo] | <code>string</code> | <code>&quot;aes-256-crt&quot;</code> | the algorithm to use. |
| [ivLength] | <code>int</code> | <code>16</code> | its initialization vector length. |


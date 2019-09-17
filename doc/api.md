# json-cipher-value API Reference

This module is a simple encrypting and decrypting module
based on the build-in [crypto](https://nodejs.org/api/crypto.html) node module. It performs
**recursive** encrypting of object values remaining their types.

It is mainly based on the [crypto.createcipheriv](https://nodejs.org/api/crypto.html#crypto_crypto_createcipheriv_algorithm_key_iv_options)
function and corrolary to the [crypto.createdecipheriv](https://nodejs.org/api/crypto.html#crypto_crypto_createdecipheriv_algorithm_key_iv_options)
one using a randomly generated initalization vector.

The entry point is the [cipher object factory](module:json-cipher-value~factory) that creates
a (un)ciphering object.

Note default settings are performing an aes-256-crt ciphering.

**See**: [https://nodejs.org/api/crypto.html](https://nodejs.org/api/crypto.html) for further information.  
**Version**: 1.1.2  
<a name="exp_module_json-cipher-value--factory"></a>

### factory(secret, [options]) : [<code>CryptObject</code>](#module_cryptObjects..CryptObject) ⏏
Factory that creates a (un)ciphering object.

**Kind**: Exported function  

| Param | Type | Description |
| --- | --- | --- |
| secret | <code>string</code> | The secret key or pawssord that will be used to create the  key for (un)ciphering step. |
| [options] | [<code>Options</code>](#module_cryptObjects..Options) | (Un)Ciphering Settings.  Use of default settings performs an aes-256-crt ciphering. |

**Example**  
```js
const createCryptObject = require('json-cipher-value')

const secret = 'My secret password'
let object = {...} // Object to cipher

let cryptObject = createCryptObject(secret)

let encryptedObject = cryptObject.encrypt(object)

let decryptedObject = cryptObject.decrypt(encryptedObject)
```

Internal module objects of interest.


* [cryptObjects](#module_cryptObjects)
    * [~CryptData](#module_cryptObjects..CryptData)
        * [new CryptData(secret, [options])](#new_module_cryptObjects..CryptData_new)
        * [.encryptd(data)](#module_cryptObjects..CryptData+encryptd) : <code>string</code>
        * [.decryptd(data)](#module_cryptObjects..CryptData+decryptd) : <code>string</code> \| <code>integer</code> \| <code>boolean</code>
    * [~CryptObject](#module_cryptObjects..CryptObject) ⇐ [<code>CryptData</code>](#module_cryptObjects..CryptData)
        * [.encrypt(object)](#module_cryptObjects..CryptObject+encrypt) : <code>Object</code>
        * [.decrypt(object)](#module_cryptObjects..CryptObject+decrypt) : <code>Object</code>
        * [.encryptd(data)](#module_cryptObjects..CryptData+encryptd) : <code>string</code>
        * [.decryptd(data)](#module_cryptObjects..CryptData+decryptd) : <code>string</code> \| <code>integer</code> \| <code>boolean</code>
    * _Typedefs_
        * [~Options](#module_cryptObjects..Options) : <code>Object</code>

<a name="module_cryptObjects..CryptData"></a>

### cryptObjects~CryptData
Intermediate object that handles single data (un)ciphering.

**Kind**: inner class of [<code>cryptObjects</code>](#module_cryptObjects)  

* [~CryptData](#module_cryptObjects..CryptData)
    * [new CryptData(secret, [options])](#new_module_cryptObjects..CryptData_new)
    * [.encryptd(data)](#module_cryptObjects..CryptData+encryptd) : <code>string</code>
    * [.decryptd(data)](#module_cryptObjects..CryptData+decryptd) : <code>string</code> \| <code>integer</code> \| <code>boolean</code>

<a name="new_module_cryptObjects..CryptData_new"></a>

#### new CryptData(secret, [options])
Create a new CryptData object using specifed options.


| Param | Type | Description |
| --- | --- | --- |
| secret | <code>string</code> | The secret key or password that will be used to create the  key for (un)ciphering step. |
| [options] | [<code>Options</code>](#module_cryptObjects..Options) | (Un)Ciphering Settings.  Use of default settings performs an aes-256-crt ciphering. |

<a name="module_cryptObjects..CryptData+encryptd"></a>

#### cryptData.encryptd(data) : <code>string</code>
Cipher a given data.

For each call, an iv vector will be randomly generated.

Note retained type are integer, boolean, or string. All other kind of values
will be treated as string.

**Kind**: instance method of [<code>CryptData</code>](#module_cryptObjects..CryptData)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>string</code> \| <code>integer</code> \| <code>boolean</code> \| <code>\*</code> | Data to cipher. |

<a name="module_cryptObjects..CryptData+decryptd"></a>

#### cryptData.decryptd(data) : <code>string</code> \| <code>integer</code> \| <code>boolean</code>
Uncipher data.

For this step, note the CryptData object **must be initialized with the same options as for the ciphering** step.

**Kind**: instance method of [<code>CryptData</code>](#module_cryptObjects..CryptData)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>string</code> | Data to uncipher. |

<a name="module_cryptObjects..CryptObject"></a>

### cryptObjects~CryptObject ⇐ [<code>CryptData</code>](#module_cryptObjects..CryptData)
Object in charge to (un)cipher js object values.

**Kind**: inner class of [<code>cryptObjects</code>](#module_cryptObjects)  
**Extends**: [<code>CryptData</code>](#module_cryptObjects..CryptData)  

* [~CryptObject](#module_cryptObjects..CryptObject) ⇐ [<code>CryptData</code>](#module_cryptObjects..CryptData)
    * [.encrypt(object)](#module_cryptObjects..CryptObject+encrypt) : <code>Object</code>
    * [.decrypt(object)](#module_cryptObjects..CryptObject+decrypt) : <code>Object</code>
    * [.encryptd(data)](#module_cryptObjects..CryptData+encryptd) : <code>string</code>
    * [.decryptd(data)](#module_cryptObjects..CryptData+decryptd) : <code>string</code> \| <code>integer</code> \| <code>boolean</code>

<a name="module_cryptObjects..CryptObject+encrypt"></a>

#### cryptObject.encrypt(object) : <code>Object</code>
Cipher object. It returns a copy of the object containing with its values ciphered.

**Kind**: instance method of [<code>CryptObject</code>](#module_cryptObjects..CryptObject)  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | Object to cipher. |

<a name="module_cryptObjects..CryptObject+decrypt"></a>

#### cryptObject.decrypt(object) : <code>Object</code>
Uncipher object. It returns a copy of the ciphered object with unciphered values.

Note this unciphering step must be done using the same settings as for ciphering.

**Kind**: instance method of [<code>CryptObject</code>](#module_cryptObjects..CryptObject)  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | Ciphered object to uncipher. |

<a name="module_cryptObjects..CryptData+encryptd"></a>

#### cryptObject.encryptd(data) : <code>string</code>
Cipher a given data.

For each call, an iv vector will be randomly generated.

Note retained type are integer, boolean, or string. All other kind of values
will be treated as string.

**Kind**: instance method of [<code>CryptObject</code>](#module_cryptObjects..CryptObject)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>string</code> \| <code>integer</code> \| <code>boolean</code> \| <code>\*</code> | Data to cipher. |

<a name="module_cryptObjects..CryptData+decryptd"></a>

#### cryptObject.decryptd(data) : <code>string</code> \| <code>integer</code> \| <code>boolean</code>
Uncipher data.

For this step, note the CryptData object **must be initialized with the same options as for the ciphering** step.

**Kind**: instance method of [<code>CryptObject</code>](#module_cryptObjects..CryptObject)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>string</code> | Data to uncipher. |

<a name="module_cryptObjects..Options"></a>

### cryptObjects~Options : <code>Object</code>
(Un)cipher object settings.

Note **next to ciphering process, unciphering must be performed with the same options values**.

**Kind**: inner typedef of [<code>cryptObjects</code>](#module_cryptObjects)  
**Category**: Typedefs  
**See**: [https://nodejs.org/api/crypto.html](https://nodejs.org/api/crypto.html) for further information; in particular about
available algorithms and theirs iv lengths.  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [algo] | <code>string</code> | <code>&quot;aes-256-crt&quot;</code> | the algorithm to use. |
| [ivLength] | <code>int</code> | <code>16</code> | its initialization vector length. |
| [isTyped] | <code>boolean</code> | <code>true</code> | if true, the type of values should be retained.  Otherwise values will be ciphered as string. |


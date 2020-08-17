/* eslint-env mocha */
'use strict'

const assert = require('assert')
const fs = require('fs')
const rimraf = require('rimraf')
const rewire = require('rewire')

const { CryptData, CryptObject } = require('../lib/cryptObjects')
const tr = require('../lib/tr')
const factory = require('../index')

const DEFAULT_ALGO = 'aes-256-ctr'
const DEFAULT_IV_LENGTH = 16

const DEFAULT_CFGS = [
  { desc: 'algo', prop: '_algo', value: DEFAULT_ALGO },
  { desc: 'iv length', prop: '_ivLength', value: DEFAULT_IV_LENGTH }
]

// ///////////////////////////////////////
// Walk and Transform
// ///////////////////////////////////////

describe('Walker and apply fn to values object', () => {
  const object = {
    a: 'a value',
    b: { a: 'x', b: 'yy' },
    c: { x: 'a', y: { ya: 123, yb: ['X', 'Y', 'Z'] } },
    e: ['a', 13, { a: 4, b: { ba: 45.2, bb: false } }]
  }

  const subObjects = [
    { desc: 'result', to: (o) => o },
    { desc: 'first level object prop', to: (o) => o.b },
    { desc: 'deeply nested object prop', to: (o) => o.c.y },
    { desc: 'array', to: (o) => o.e },
    { desc: 'object in an array', to: (o) => o.e[2] },
    { desc: 'nested object prop in array', to: (o) => o.e[2].b }
  ]

  describe('Walker', () => {
    let res
    beforeEach(() => { res = tr(object) })

    describe('Check if all properties exist in result', () => {
      subObjects.forEach(sub => {
        it(`Case for ${sub.desc}`, () => {
          const props1 = Object.keys(sub.to(res))
          const props2 = Object.keys(sub.to(object))

          const diff = [
            ...props1.filter(prop => !props2.includes(prop)),
            ...props2.filter(prop => !props1.includes(prop))
          ].length !== 0

          assert(!diff)
        })
      })
    })

    describe('Check if result and object properties are cloned', () => {
      subObjects.forEach(sub => {
        it(`Case for ${sub.desc}`, () => {
          assert(sub.to(res) !== sub.to(object))
        })
      })
    })

    describe('Check values', () => {
      it('Case for primitive type', () => {
        assert.strictEqual(res.a, object.a)
      })

      subObjects.forEach(sub => {
        it(`Case for ${sub.desc}`, () => {
          assert.deepStrictEqual(res, object)
        })
      })
    })
  })

  describe('Apply fn to input', () => {
    const fn = (v) => `XXX${v}`
    const tests = [
      { type: 'primitive', value: 'AA', expected: 'XXXAA' },
      { type: 'array', value: [10, 20, 30], expected: ['XXX10', 'XXX20', 'XXX30'] },
      { type: 'object', value: { a: 3, b: { a: '5' } }, expected: { a: 'XXX3', b: { a: 'XXX5' } } }
    ]

    it('No fn => Identity', () => {
      const object = { a: 3, b: { a: '5' } }
      const res = tr(object)
      assert.deepStrictEqual(res, object)
    })
    tests.forEach(test => it(`Apply fn to ${test.type}`, () => {
      const res = tr(test.value, fn)
      assert.deepStrictEqual(res, test.expected)
    }))
  })
})

// ///////////////////////////////////////
// Cipher Objects
// ///////////////////////////////////////

describe('Cipher Objects', () => {
  const secret = 'My dummy secret password'
  const secret1 = 'My other dummy secret'

  describe('Cipher Data Object', () => {
    describe('Instantiate Cipher Data object', () => {
      it('should not throw', () => {
        assert.doesNotThrow(() => new CryptData(secret))
      })
    })
    describe('Default settings', () => {
      let cipherd

      before(() => { cipherd = new CryptData(secret) })

      DEFAULT_CFGS.forEach(setting => {
        it(`Default setting for '${setting.desc}' should be ${setting.value}`, () => {
          assert.strictEqual(cipherd[setting.prop], setting.value)
        })
      })
    })

    describe('Ciphering data', () => {
      let cipherd

      before(() => { cipherd = new CryptData(secret) })

      describe('Basic', () => {
        it('Data is ciphered', () => {
          const value = 'abcd'
          const ciphertext = cipherd.encryptd(value)
          assert.notStrictEqual(value, ciphertext)
        })
        it('Same data ciphered with same cipher does not produce same ciphertext', () => {
          const value = 'abcd'
          const ciphertext1 = cipherd.encryptd(value)
          const ciphertext2 = cipherd.encryptd(value)
          assert.notStrictEqual(ciphertext1, ciphertext2)
        })
      })
    })

    describe('Deciphering step', () => {
      describe('Basic', () => {
        it('Wrong secret does not produce expected result', () => {
          const value = 'abcd'
          const cipherd = new CryptData(secret)
          const ciphertext = cipherd.encryptd(value)

          const cipherd1 = new CryptData(secret1)
          const result = cipherd1.decryptd(ciphertext)

          assert.notStrictEqual(value, result)
        })
      })

      describe('Check unciphering of typed values', () => {
        const values = [
          { type: 'string', value: 'aaaaa', desc: 'a string' },
          { type: 'string', value: '10', desc: 'an integer in a string' },
          { type: 'string', value: '10.7', desc: 'a float in a string' },
          { type: 'boolean', value: false, desc: 'a boolean (false)' },
          { type: 'boolean', value: true, desc: 'a boolean (true)' },
          { type: 'number', value: 107.57, desc: 'a float' },
          { type: 'number', value: 107, desc: 'an integer' },
          { type: 'number', value: 0, desc: '0' }
        ]
        before(() => {
          // cipher values
          const cipherd = new CryptData(secret)
          values.forEach(value => {
            value.ciphertext = cipherd.encryptd(value.value)
          })
        })

        values.forEach(value => {
          it(`Desciphering ${value.desc} (expected type: ${value.type})`, () => {
            const cipherd = new CryptData(secret)
            assert.strictEqual(value.value, cipherd.decryptd(value.ciphertext))
          })
        })
      })
    })
  })
  describe('Cipher Object', () => {
    describe('Instantiate Cipher Object object', () => {
      it('Should not throw', () => {
        assert.doesNotThrow(() => new CryptObject(secret))
      })
    })
    describe('Default settings', () => {
      let cipher

      before(() => { cipher = new CryptObject(secret) })

      DEFAULT_CFGS.forEach(setting => {
        it(`Default setting for '${setting.desc}' should be ${setting.value}`, () => {
          assert.strictEqual(cipher[setting.prop], setting.value)
        })
      })
    })

    describe('Ciphering data, object or array', () => {
      let cipher

      before(() => { cipher = new CryptObject(secret) })

      it('Primitive type is ciphered', () => {
        const value = 'abcd'
        const ciphertext = cipher.encrypt(value)
        assert.notDeepStrictEqual(value, ciphertext)
      })
      it('Object is ciphered', () => {
        const object = { a: 1, b: true }
        const cipheredObject = cipher.encrypt(object)
        assert.notDeepStrictEqual(object, cipheredObject)
      })
      it('Array is ciphered', () => {
        const array = [1, 3, 4, 1]
        const cipheredObject = cipher.encrypt(array)
        assert.notDeepStrictEqual(array, cipheredObject)
      })
    })

    describe('Unciphering data, object or array', () => {
      let cipher

      before(() => { cipher = new CryptObject(secret) })

      it('Primitive type is unciphered', () => {
        const value = 'abcd'
        const ciphertext = cipher.encrypt(value)
        const res = cipher.decrypt(ciphertext)
        assert.deepStrictEqual(res, value)
      })
      it('Object is unciphered', () => {
        const object = { a: 1, b: true }
        const cipheredObject = cipher.encrypt(object)
        const res = cipher.decrypt(cipheredObject)
        assert.deepStrictEqual(res, object)
      })
      it('Array is unciphered', () => {
        const array = [1, 3, 4, 1]
        const cipheredObject = cipher.encrypt(array)
        const res = cipher.decrypt(cipheredObject)
        assert.deepStrictEqual(res, array)
      })
    })
  })
})

// ///////////////////////////////////////
// Module facing factory
// ///////////////////////////////////////

describe('Module facing factory', () => {
  const secret = 'My secret password'

  it('Should not throw', () => {
    assert.doesNotThrow(() => factory(secret))
  })
  it('Return a cipher objet', () => {
    const cipherObject = factory(secret)
    assert(cipherObject instanceof CryptData)
  })
  it('Should use default config if no user\'s settings', () => {
    const cipherObject = factory(secret)
    assert.deepStrictEqual(
      {
        algo: cipherObject._algo,
        ivLength: cipherObject._ivLength
      }, {
        algo: DEFAULT_ALGO,
        ivLength: DEFAULT_IV_LENGTH
      }
    )
  })
  it('Should apply user\'s settings', () => {
    const config = {
      algo: 'my-great-algo',
      ivLength: 32
    }
    const cipherObject = factory(secret, config)
    assert.deepStrictEqual(
      {
        algo: cipherObject._algo,
        ivLength: cipherObject._ivLength
      }, {
        algo: config.algo,
        ivLength: config.ivLength
      }
    )
  })
})

// ///////////////////////////////////////
// File ciphering (CLI)
// ///////////////////////////////////////

describe('CLI test (files)', () => {
  const perform = rewire('../cli/commands').__get__('perform')
  const secret = 'My secret password'
  const testDir = `${process.cwd()}/test_dir`

  before(() => {
    rimraf.sync(testDir)
  })

  describe('Cipher file', () => {
    let src, srcObject, tgt, resultObject

    before(() => {
      src = `${__dirname}/ateam.json`
      srcObject = JSON.parse(fs.readFileSync(src, 'utf8'))
      tgt = `${testDir}/ateam.cjson`
    })

    it('Should not throw', async () => {
      await perform('cipher', {
        file: src,
        secret,
        E: '.cjson',
        d: testDir
      })
      resultObject = JSON.parse(fs.readFileSync(tgt, 'utf8'))
    })

    it('JSON structure should have been retained', () => {
      const r1 = tr(resultObject, v => '')
      const s1 = tr(srcObject, v => '')
      assert.deepStrictEqual(r1, s1)
    })

    it('Values should have been ciphered', () => {
      const cipherObject = factory(secret)
      const decipheredResult = tr(resultObject, v => cipherObject.decryptd(v))
      assert.deepStrictEqual(decipheredResult, srcObject)
    })
  })

  describe('Decipher file', () => {
    let src, srcObject, tgt, resultObject

    before(() => {
      src = `${__dirname}/ateam.cjson`
      srcObject = JSON.parse(fs.readFileSync(src, 'utf8'))
      tgt = `${testDir}/ateam.json`
    })

    it('Should not throw', async () => {
      await perform('uncipher', {
        file: src,
        secret,
        d: testDir
      })

      resultObject = JSON.parse(fs.readFileSync(tgt, 'utf8'))
    })

    it('JSON structure should have been retained', () => {
      const r1 = tr(resultObject, v => '')
      const s1 = tr(srcObject, v => '')
      assert.deepStrictEqual(r1, s1)
    })

    it('Values should have been deciphered', () => {
      const refObject = JSON.parse(fs.readFileSync(`${__dirname}/ateam.json`, 'utf8'))
      assert.deepStrictEqual(resultObject, refObject)
    })
  })
})

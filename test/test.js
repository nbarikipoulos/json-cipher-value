/* eslint-env mocha */
'use strict'

const assert = require('assert')
const fs = require('fs')
const rimraf = require('rimraf')
const rewire = require('rewire')

const CipherObject = require('../lib/CipherObject')
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
// Cipher Object
// ///////////////////////////////////////

describe('Cipher Object', () => {
  const secret = 'My dummy secret password'
  const secret1 = 'My other dummy secret'

  describe('Instantiate Cipher object', () => {
    it('should not throw', () => {
      assert.doesNotThrow(() => new CipherObject(secret))
    })
  })

  describe('Settings', () => {
    DEFAULT_CFGS.forEach(setting => {
      const cipherObject = new CipherObject(secret)
      it(`Default setting for '${setting.desc}' should be ${setting.value}`, () => {
        assert.strictEqual(cipherObject[setting.prop], setting.value)
      })
    })

    it('Should apply user\'s settings', () => {
      const myConfig = { algo: 'my-great-algo', ivLength: 32 }
      const cipherObject = new CipherObject(secret, myConfig)
      assert.deepStrictEqual(
        { algo: cipherObject._algo, ivLength: cipherObject._ivLength },
        { algo: myConfig.algo, ivLength: myConfig.ivLength }
      )
    })
  })

  describe('(De)Ciphering primitive type', () => {
    let cipher

    before(() => { cipher = new CipherObject(secret) })

    describe('Ciphering', () => {
      it('Data is ciphered', () => {
        const value = 'abcd'
        const ciphertext = cipher.perform('cipher', value)
        assert.notStrictEqual(value, ciphertext)
      })
      it('Same data ciphered with same cipher does not produce same ciphertext', () => {
        const value = 'abcd'
        const ciphertext1 = cipher.perform('cipher', value)
        const ciphertext2 = cipher.perform('cipher', value)
        assert.notStrictEqual(ciphertext1, ciphertext2)
      })
    })

    describe('Deciphering', () => {
      describe('Basic', () => {
        it('Wrong secret does not produce expected result', () => {
          const value = 'abcd'
          const cipher = new CipherObject(secret)
          const ciphertext = cipher.perform('cipher', value)

          const cipher1 = new CipherObject(secret1)
          const result = cipher1.perform('decipher', ciphertext)

          assert.notStrictEqual(value, result)
        })
      })

      describe('Check deciphering of typed values', () => {
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
          const cipher = new CipherObject(secret)
          values.forEach(value => { // cipher values
            value.ciphertext = cipher.perform('cipher', value.value)
          })
        })

        values.forEach(value => {
          it(`Desciphering ${value.desc} (expected type: ${value.type})`, () => {
            const cipher = new CipherObject(secret)
            assert.strictEqual(value.value, cipher.perform('decipher', value.ciphertext))
          })
        })
      })
    })
  })

  describe('(De)Ciphering object/array', () => {
    describe('Ciphering object or array', () => {
      let cipher

      before(() => { cipher = new CipherObject(secret) })

      it('Object is ciphered', () => {
        const object = { a: 1, b: true }
        const cipheredObject = cipher.perform('cipher', object)
        assert.notDeepStrictEqual(object, cipheredObject)
      })
      it('Array is ciphered', () => {
        const array = [1, 3, 4, 1]
        const cipheredObject = cipher.perform('cipher', array)
        assert.notDeepStrictEqual(array, cipheredObject)
      })
    })

    describe('Deciphering object/array', () => {
      let cipher

      before(() => { cipher = new CipherObject(secret) })

      it('Object is deciphered', () => {
        const object = { a: 1, b: true }
        const cipheredObject = cipher.perform('cipher', object)
        const res = cipher.perform('decipher', cipheredObject)
        assert.deepStrictEqual(res, object)
      })
      it('Array is deciphered', () => {
        const array = [1, 3, 4, 1]
        const cipheredObject = cipher.perform('cipher', array)
        const res = cipher.perform('decipher', cipheredObject)
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
    assert(cipherObject instanceof CipherObject)
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
    const myConfig = { algo: 'my-great-algo', ivLength: 32 }
    const cipherObject = factory(secret, myConfig)
    assert.deepStrictEqual(
      { algo: cipherObject._algo, ivLength: cipherObject._ivLength },
      { algo: myConfig.algo, ivLength: myConfig.ivLength }
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
      const decipheredResult = tr(resultObject, v => cipherObject.perform('decipher', v))
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
      await perform('decipher', {
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

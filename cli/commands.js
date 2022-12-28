import { promisify } from 'node:util'
import { Transform, pipeline } from 'node:stream'

import vfs from 'vinyl-fs'

import factory from '../index.js'
import getArg from './arguments.js'

export default [{
  cmd: 'cipher <file> <secret>',
  desc: 'Cipher json files',
  builder: (yargs) => {
    const helper = new Helper(yargs)

    helper.addOptions('dest', 'ext')
      .addPositional('file')
      .addPositional('secret')
      .yargs
      .strict()
      .example(
        '$0 cipher src/data/**/*.json  \'My secret password\'',
        'Cipher all json file in src/data to *.cjson files'
      )
      .example(
        '$0 cipher my.json -e .json -d target \'My secret password\'',
        'Cipher file my.json to ./target/my.json'
      )
  },
  handler: (argv) => perform('cipher', argv)
}, {
  cmd: 'decipher <file> <secret>',
  desc: 'Decipher json files',
  builder: (yargs) => {
    const helper = new Helper(yargs)

    helper.addOptions('dest')
      .addPositional('file')
      .addPositional('secret')
      .yargs
      .strict()
      .example(
        '$0 decipher src/data/**/*.cjson  \'My secret password\'',
        'Decipher all cjson file in src/data'
      )
      .example(
        '$0 decipher my.cjson -d target \'My secret password\'',
        'Decipher file my.cjson to ./target/my.json'
      )
  },
  handler: (argv) => perform('decipher', argv)
}]

// ////////////////////////////////
// Main job
// ////////////////////////////////

export const perform = async (action, argv) => {
  const options = {}
  const secret = argv.secret

  const ext = action === 'cipher' ? argv.E : '.json'

  const tgtFolder = argv.d
    ? argv.d
    : (file) => file.base

  const cipher = cipherFile(
    action,
    factory(secret, options)
  )

  const rename = renameFile(ext)

  const pPipeline = promisify(pipeline)
  await pPipeline(
    vfs.src(argv.file),
    cipher,
    rename,
    vfs.dest(tgtFolder)
  )
}

// ////////////////////////////////
// Streams
// ////////////////////////////////

const cipherFile = (action, cipherObject) => {
  const transform = new Transform({ objectMode: true })
  transform._transform = (file, enc, cb) => {
    try {
      const json = JSON.parse(file.contents)
      const data = cipherObject.perform(action, json)
      file.contents = Buffer.from(JSON.stringify(data, null, 2))
      cb(null, file)
    } catch (e) {
      // Failed to parse json/(de)cipher it
      console.log(`Warning: unable to ${action} ${file.path}`)
      cb(null, null)
    }
  }

  return transform
}

const renameFile = (ext) => {
  const transform = new Transform({ objectMode: true })
  transform._transform = (file, enc, cb) => {
    file.extname = ext
    cb(null, file)
  }
  return transform
}

// ////////////////////////////////
// CLI helper
// ////////////////////////////////

class Helper {
  constructor (yargs) {
    this._yargs = yargs
  }

  get yargs () { return this._yargs }

  addOptions (...optionNames) {
    for (const name of optionNames) {
      const desc = getArg(name)
      this._yargs.options(desc.key, desc.opt)
    }

    return this
  }

  addPositional (key, cliKey = key) {
    const desc = getArg(key)
    this._yargs.positional(cliKey, desc.opt)

    return this
  }
}

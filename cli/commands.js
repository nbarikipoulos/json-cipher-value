/*! Copyright (c) 2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const util = require('util')
const stream = require('stream')

// const through2 = require('through2')
const vfs = require('vinyl-fs')

const factory = require('../index')
const { Stream } = require('stream')

// ////////////////////////////////
// ////////////////////////////////
// Public API
// ////////////////////////////////
// ////////////////////////////////

module.exports = yargs => yargs
  .command(
    'cipher <file> <secret>',
    'Cipher json files',
    yargs => addOptions(
      yargs,
      'cipher',
      'dest', 'extension'
    ),
    argv => perform('cipher', argv)
  )
  .command(
    'decipher <file> <secret>',
    'Decipher crypted json files',
    yargs => addOptions(
      yargs,
      'decipher',
      'dest'
    ),
    argv => perform('decipher', argv)
  )

// ////////////////////////////////
// ////////////////////////////////
// Private
// ////////////////////////////////
// ////////////////////////////////

// ////////////////////////////////
// Main job
// ////////////////////////////////

const perform = async (action, argv) => {
  const options = {}
  const secret = argv.secret

  const fname = action === 'cipher' ? 'encrypt' : 'decrypt'
  const ext = action === 'cipher' ? argv.E : '.json'

  const tgtFolder = argv.d
    ? argv.d
    : file => file.base

  const cryptObject = factory(secret, options)

  const cipher = new stream.Transform({ objectMode: true })
  cipher._transform = (file, enc, cb) => {
    try {
      const json = JSON.parse(file.contents)
      const data = cryptObject[fname](json)
      file.contents = Buffer.from(JSON.stringify(data, null, 2))
      cb(null, file)
    } catch (e) {
      // failed to parse json/(de)cipher it
      console.log(`Warning: unable to ${action} ${file.path}`)
      cb(null, null)
    }
  }

  const renameFile = (ext) => {
    const transform = new Stream.Transform({ objectMode: true })
    transform._transform = (file, enc, cb) => {
      file.extname = ext
      cb(null, file)
    }
    return transform
  }

  const pipeline = util.promisify(stream.pipeline)
  await pipeline(
    vfs.src(argv.file),
    cipher,
    renameFile(ext),
    vfs.dest(tgtFolder)
  )
}

// ////////////////////////////////
// CLI misc.
// ////////////////////////////////

const addOptions = (yargs, name, ...options) => {
  options.forEach(name => {
    const desc = _ARG_DESC[name]
    yargs.option(desc.key, desc.detail)
  })

  const pre = name === 'cipher' ? '' : 'de'

  yargs
    .positional('file', {
      describe: `Target file (globs supported for multi files ${pre}ciphering)`,
      type: 'string'
    })
    .positional('secret', {
      describe: 'Secret key or password',
      type: 'string'
    })
    .example(
      `$0 ${name} src/data/**/*.json  'My secret password'`,
      `${pre}cipher all json file in src/data`
    )
}

const _ARG_DESC = {
  dest: {
    key: 'd',
    detail: {
      alias: 'dest',
      type: 'string',
      describe: 'Target folder (use source folder if not set).'
    }
  },
  typed: {
    key: 'T',
    detail: {
      alias: 'typed',
      type: 'boolean',
      default: true,
      describe: 'Retains types of value'
    }
  },
  extension: {
    key: 'E',
    detail: {
      alias: 'ext',
      type: 'string',
      default: '.cjson',
      describe: 'File extension for ciphered json'
    }
  }
}

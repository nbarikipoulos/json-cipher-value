'use strict'

const { promisify } = require('util')
const stream = require('stream')

const vfs = require('vinyl-fs')

const factory = require('../index')

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
    'Decipher json files',
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

  const ext = action === 'cipher' ? argv.E : '.json'

  const tgtFolder = argv.d
    ? argv.d
    : (file) => file.base

  const cipherObject = factory(secret, options)

  const cipher = new stream.Transform({ objectMode: true })
  cipher._transform = (file, enc, cb) => {
    try {
      const json = JSON.parse(file.contents)
      const data = cipherObject.perform(action, json)
      file.contents = Buffer.from(JSON.stringify(data, null, 2))
      cb(null, file)
    } catch (e) {
      // failed to parse json/(de)cipher it
      console.log(`Warning: unable to ${action} ${file.path}`)
      cb(null, null)
    }
  }

  const renameFile = (ext) => {
    const transform = new stream.Transform({ objectMode: true })
    transform._transform = (file, enc, cb) => {
      file.extname = ext
      cb(null, file)
    }
    return transform
  }

  const pipeline = promisify(stream.pipeline)
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

const addOptions = (yargs, action, ...options) => {
  options.forEach(name => {
    const desc = _ARG_DESC[name]
    yargs.option(desc.key, desc.detail)
  })

  const prefix = action === 'cipher' ? '' : 'de'

  yargs
    .positional('file', {
      describe: `Target file (globs supported for multi files ${prefix}ciphering)`,
      type: 'string'
    })
    .positional('secret', {
      describe: 'Secret key or password',
      type: 'string'
    })
    .example(
      `$0 ${action} src/data/**/*.json  'My secret password'`,
      `${prefix}cipher all json file in src/data`
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

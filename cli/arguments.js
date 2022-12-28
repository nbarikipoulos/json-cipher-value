// first, check 'alias'. On a second hand, use 'key' (for positional)
export default (name) => ARGS.find(arg => arg.opt?.alias === name || arg.key === name)

const ARGS = [{
  key: 'd',
  opt: {
    alias: 'dest',
    type: 'string',
    describe: 'Target folder (use source folder if not set).'
  }
}, {
  key: 'E',
  opt: {
    alias: 'ext',
    type: 'string',
    default: '.cjson',
    describe: 'File extension for ciphered json'
  }
}, {
  key: 'file', // positional
  opt: {
    type: 'string',
    describe: 'Target file(s)'
  }
}, {
  key: 'secret', // positional
  opt: {
    type: 'string',
    describe: 'Secret key or password'
  }
}]

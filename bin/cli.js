#!/usr/bin/env node

const yargs = require('yargs')

yargs
  .usage('Usage: $0 <command> --help for detailed help')
  .demandCommand(1, 'Use at least one command')
  .locale('en')

// add (de)cipher commands
require('../cli/commands')(yargs)

// At last, common options
yargs
  .version()
  .alias('h', 'help')

// ////////////////////////////////
// ////////////////////////////////
// Main job
// ////////////////////////////////
// ////////////////////////////////

yargs
  .wrap(yargs.terminalWidth())
  .strict()
  .parse()

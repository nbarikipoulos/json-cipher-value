#!/usr/bin/env node

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import commands from '../cli/commands.js'

const yarg = yargs(hideBin(process.argv))

yarg
  .usage('Usage: $0 <command> --help for detailed help')
  .demandCommand(1, 'Use at least one command')
  .locale('en')

// add (de)cipher commands
commands(yarg)

// At last, common options
yarg
  .version()
  .alias('h', 'help')

// ////////////////////////////////
// ////////////////////////////////
// Main job
// ////////////////////////////////
// ////////////////////////////////

yarg
  .wrap(yarg.terminalWidth())
  .strict()
  .parse()

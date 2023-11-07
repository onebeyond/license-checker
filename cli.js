#!/usr/bin/env node

const yargs = require('yargs')(process.argv.slice(2));
const { checkArgs } = require('./src/utils');

// https://github.com/yargs/yargs/blob/main/docs/advanced.md#commanddirdirectory-opts
module.exports = yargs
  .parserConfiguration({ 'camel-case-expansion': false })
  .commandDir('commands')
  .demandCommand()
  .check(checkArgs)
  .help()
  .alias('help', 'h')
  .argv;

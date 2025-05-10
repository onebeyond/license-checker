#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { commands } from './commands/index.js';

// https://github.com/yargs/yargs/blob/main/docs/advanced.md#commanddirdirectory-opts
export default yargs(hideBin(process.argv))
  .parserConfiguration({ 'camel-case-expansion': false })
  .command(commands)
  .demandCommand()
  .check(checkArgs)
  .help()
  .alias('help', 'h')
  .parse();

const yargs = require('yargs')(process.argv.slice(2));

// https://github.com/yargs/yargs/blob/main/docs/advanced.md#commanddirdirectory-opts
module.exports = yargs
  .commandDir('commands')
  .demandCommand()
  .help()
  .alias('help', 'h')
  .argv;

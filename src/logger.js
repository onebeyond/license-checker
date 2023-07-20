const chalk = require('chalk');

const info = (msg) => console.info(chalk.green(msg));

const warn = (msg) => console.warn(chalk.yellow(msg));

const error = (msg) => console.error(chalk.red(msg));

const debug = (msg) => console.debug(chalk.gray(msg));

module.exports = {
  info,
  warn,
  error,
  debug
};

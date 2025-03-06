import chalk from 'chalk';

const log = (msg) => console.log(chalk(msg));

const info = (msg) => console.info(chalk.green(msg));

const warn = (msg) => console.warn(chalk.yellow(msg));

const error = (msg) => console.error(chalk.red(msg));

const debug = (msg) => console.debug(chalk.gray(msg));

export default {
  log,
  info,
  warn,
  error,
  debug
};

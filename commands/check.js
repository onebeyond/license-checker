import { check } from '../src/runner.js';
import logger from '../src/logger.js';

export const command = 'check <license>';

export const describe = 'check if a license is SPDX compliant';

export const handler = function (argv) {
  const { license } = argv;

  try {
    check(license);
  } catch (e) {
    logger.error(e.message);
    process.exit(1);
  }
};

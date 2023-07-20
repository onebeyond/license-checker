const { check } = require('../src/runner');
const { error } = require('../src/logger');

exports.command = 'check <license>';

exports.describe = 'check if a license is SPDX compliant';

exports.handler = function (argv) {
  const { license } = argv;

  try {
    check(license);
  } catch (e) {
    error(e.message);
    process.exit(1);
  }
};

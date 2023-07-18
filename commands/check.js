const { check } = require('../src/runner');

exports.command = 'check <license>';

exports.describe = 'check if a license is SPDX compliant';

exports.builder = {
};

exports.handler = function (argv) {
  const { license } = argv;

  try {
    check(license);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
};

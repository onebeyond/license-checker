const runner = require('../src/runner');

exports.command = 'checkLicense <license>';

exports.describe = 'check if a license is SPDX compliant';

exports.handler = function (argv) {
  const license = argv.license;

  try {
    runner.check(license);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
};

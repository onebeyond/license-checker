#!/usr/bin/env node

const checker = require('./src/checker');
const args = require('./src/args');
const middleware = require('./src/middleware');
const runner = require('./src/runner');
const spdxValidator = require('./src/spdx-validator');

(async () => {
  try {
    const parsedArgs = middleware(args);
    if (args.checkLicense) {
      const license = args.checkLicense.trim();
      spdxValidator.isSpdxCompliant(license);
      console.info(`License ${license} is SPDX compliant`);
      return;
    }

    await runner.run(checker, parsedArgs);
    console.info('License check completed! No forbidden licenses packages found.');
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
})();

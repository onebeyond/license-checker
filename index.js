#!/usr/bin/env node

const checker = require('./src/checker');
const args = require('./src/args');
const middleware = require('./src/middleware');
const runner = require('./src/runner');

(async () => {
  try {
    await runner.run(checker, middleware(args));
    console.info('License check completed! No forbidden licenses packages found.');
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
})();

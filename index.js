#!/usr/bin/env node

const checker = require('./src/checker');
const args = require('./src/args');
const reporter = require('./src/reporter');
const middleware = require('./src/middleware');
const runner = require('./src/runner');

(async () => {
  try {
    await runner.run(checker, reporter, middleware(args));
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
})();

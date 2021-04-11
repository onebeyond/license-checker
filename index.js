#!/usr/bin/env node

const checker = require('license-checker');

const argv = require('./src/args');
const { cleanOutput, writeReportFile } = require('./src/utils');

checker.init({
  start: __dirname,
}, (err, packages) => {
  if (err) {
    console.error('license-checker error:', err);
    process.exit(1);
  }

  const cleanedPackages = cleanOutput(packages);

  if (argv.failOn) {
    const parsedFailOn = argv.failOn.split(',');
    const parsedFailOnArray = parsedFailOn.map(p => p.trim());

    const failOnOutput = cleanedPackages.filter(packageInfo => parsedFailOnArray.includes(packageInfo.licenses));

    // Generate report
    if (failOnOutput.length && !argv.disableErrorReport) {
      writeReportFile(argv.errorReportFileName, failOnOutput);
    }

    // Check if should exit
    if (failOnOutput.length) {
      const failingLicensesArray = failOnOutput.map(p => p.licenses);
      const failingLicensesSet = new Set(failingLicensesArray);
      console.error('Found license defined by the --failOn flag: "' + Array.from(failingLicensesSet).join(', ') + '". Exiting.');
      process.exit(1);
    }
  }

  const parsedGenerateOutputOn = argv.generateOutputOn ? argv.generateOutputOn.split(',') : [];
  const parsedGenerateOutputOnArray = parsedGenerateOutputOn.map(p => p.trim());

  if (!parsedGenerateOutputOnArray.length || cleanedPackages.some(p => parsedGenerateOutputOnArray.includes(p.licenses))) {
    console.info('License check completed! No forbidden licenses packages found.');
    writeReportFile(argv.outputFileName, cleanedPackages);
  }
});
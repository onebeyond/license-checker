#!/usr/bin/env node

const checker = require('license-checker');
const fs = require('fs');

const argv = require('./src/args');

const cleanOutput = packages => Object.entries(packages).map(([key, value]) => {
  const { path, licenseFile, ...rest } = value;
  const validInfo = {
    package_name: key,
    ...rest,
  };

  return validInfo;
});

checker.init({
  start: __dirname,
}, (err, packages) => {
  if (err) {
    console.error('license-checker error:', err);
  } else {
    const cleanedPackages = cleanOutput(packages);

    if (argv.failOn) {
      const parsedFailOn = argv.failOn.split(',');
      const parsedFailOnArray = parsedFailOn.map(p => p.trim());

      const failOnOutput = cleanedPackages.filter(packageInfo => parsedFailOnArray.includes(packageInfo.licenses));

      // Generate report
      if (failOnOutput.length && !argv.disableErrorReport) {
        fs.writeFileSync(
          `${argv.errorReportFileName}.json`,
          JSON.stringify(failOnOutput, null, "\t"), error => {
            if (error) throw error;
          });

        console.info(`${argv.errorReportFileName}.json created!`);
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

      fs.writeFileSync(
        `${argv.outputFileName}.json`,
        JSON.stringify(cleanedPackages, null, "\t"), error => {
          if (error) throw error;
        });

      console.info(`${argv.outputFileName}.json created!`);
    }
  }
});
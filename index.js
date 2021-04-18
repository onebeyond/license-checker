#!/usr/bin/env node

const checker = require('license-checker');
const _ = require('lodash');

const argv = require('./src/args');
const { getPackageInfoList, writeReportFile } = require('./src/utils');

checker.init({
  start: argv.start
}, (err, packages) => {
  if (err) {
    console.error('license-checker error:', err);
    process.exit(1);
  }

  // Generate an array of package info objects
  const packageList = getPackageInfoList(packages);

  if (argv.failOn) {
    const parsedFailOn = argv.failOn.split(',');
    const parsedFailOnArray = parsedFailOn.map(p => p.trim());

    const invalidPackageList = packageList
      .filter(packageInfo => parsedFailOnArray.includes(packageInfo.licenses));

    // Stop execution if packages were found for the selected licenses
    if (invalidPackageList.length) {
      const forbiddenLicenseStats = invalidPackageList
        .reduce((stats, { licenses }) => ({
          ...stats,
          [licenses]: !stats[licenses] ? 1 : stats[licenses] + 1,
        }), {});

      console.error(`Found ${invalidPackageList.length} packages with licenses defined by the --failOn flag:`);
      Object.keys(forbiddenLicenseStats).forEach(license => {
        console.error(` > ${forbiddenLicenseStats[license]} packages with license ${license}`);
      });

      // Generate report with packages containing the licenses passed to `failOn`
      if (!argv.disableReport && !argv.disableErrorReport) {
        writeReportFile(argv.errorReportFileName, invalidPackageList);
      }

      process.exit(1);
    }
  }

  const parsedGenerateOutputOn = argv.generateOutputOn ? argv.generateOutputOn.split(',') : [];
  const parsedGenerateOutputOnArray = parsedGenerateOutputOn.map(p => p.trim());

  if (!parsedGenerateOutputOnArray.length || packageList.some(p => parsedGenerateOutputOnArray.includes(p.licenses))) {
    console.info('License check completed! No forbidden licenses packages found.');
    if (!argv.disableReport) {
      writeReportFile(argv.outputFileName, packageList);
    }
  }
});

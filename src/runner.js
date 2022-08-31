const {
  getPackageInfoList, writeReportFile, extractInvalidPackages
} = require('./utils');

const run = async (checker, args) => {
  const packages = await checker.parsePackages(args.start);

  const packageList = getPackageInfoList(packages);
  checkForbiddenLicenses(args, packageList);
  generateSuccessReport(args, packageList);
};

const formatForbiddenLicenseError = licenses => {
  const forbiddenLicenseStats = licenses
    .reduce((stats, { licenses }) => ({
      ...stats,
      [licenses]: !stats[licenses] ? 1 : stats[licenses] + 1
    }), {});

  const header = `Found ${licenses.length} packages with licenses defined by the --failOn flag:`;
  const lines = Object
    .entries(forbiddenLicenseStats)
    .map(([license, value]) => ` > ${value} packages with license ${license}`)
    .join('\n');

  return `${header}\n${lines}`;
};

const checkForbiddenLicenses = ({ errorReportFileName, customHeader, failOn }, packages) => {
  const forbiddenLicenses = extractInvalidPackages(failOn, packages);
  if (forbiddenLicenses.length) {
    writeReportFile(errorReportFileName, forbiddenLicenses, customHeader);
    throw new Error(formatForbiddenLicenseError(forbiddenLicenses));
  }
};

const generateSuccessReport = ({ generateOutputOn, disableReport, outputFileName, customHeader }, packages) => {
  if (packages.some(p => generateOutputOn.includes(p.licenses))) {
    if (!disableReport) {
      writeReportFile(outputFileName, packages, customHeader);
    }
  }
};

module.exports = {
  run
};

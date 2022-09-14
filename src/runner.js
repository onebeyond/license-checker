const {
  getPackageInfoList, extractInvalidPackages, formatForbiddenLicenseError
} = require('./utils');

const reporter = require('./reporter');

const run = async (checker, args) => {
  const packages = await checker.parsePackages(args.start);

  const packageList = getPackageInfoList(packages);

  const forbiddenPackages = extractInvalidPackages(args.failOn, packageList);
  if (forbiddenPackages.length) {
    reporter.writeErrorReportFile(args.errorReportFileName, forbiddenPackages);
    throw new Error(formatForbiddenLicenseError(forbiddenPackages));
  }

  const packagesIncludeLicenses = packageList.some(p => args.generateOutputOn.includes(p.licenses));
  if (!args.generateOutputOn.length || packagesIncludeLicenses) {
    if (!args.disableReport) {
      reporter.writeReportFile(args.outputFileName, packageList, args.customHeader);
    }
  }
};

module.exports = {
  run
};

const {
  getPackageInfoList, writeReportFile, extractInvalidPackages, formatForbiddenLicenseError
} = require('./utils');

const run = async (checker, args) => {
  const packages = await checker.parsePackages(args.start);

  const packageList = getPackageInfoList(packages);

  const forbiddenPackages = extractInvalidPackages(args.failOn, packageList);
  if (forbiddenPackages.length) {
    writeReportFile(args.errorReportFileName, forbiddenPackages, args.customHeader);
    throw new Error(formatForbiddenLicenseError(forbiddenPackages));
  }

  const packagesIncludeLicenses = packageList.some(p => args.generateOutputOn.includes(p.licenses));
  if (!args.disableReport && packagesIncludeLicenses) {
    writeReportFile(args.outputFileName, packageList, args.customHeader);
  }
};

module.exports = {
  run
};

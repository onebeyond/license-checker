const isSPDXCompliant = require('spdx-expression-validate');

const {
  getPackageInfoList, formatForbiddenLicenseError, generateSPDXExpression, checkSPDXCompliance, checkPackagesLicenses, isLicenseError, checkLicenseError
} = require('./utils');

const run = async (checker, reporter, args) => {
  if (args.checkLicense) {
    const license = args.checkLicense;

    // @TODO Remove after issue has been solved
    if (isLicenseError(license)) {
      throw new Error(
        'GFDL-1.x licenses are temporary unallowed. There\'s an issue pending to solve.'
      );
    }

    if (!isSPDXCompliant(license)) {
      throw new Error(`Error: License "${license}" is not SPDX compliant. Please visit https://spdx.org/licenses/ for the full list`);
    }

    console.info(`License ${license} is SPDX compliant`);
    return;
  }

  const { failOn, generateOutputOn } = args;

  checkLicenseError(failOn); // @TODO Remove after issue has been solved
  checkLicenseError(generateOutputOn);
  checkSPDXCompliance(failOn);
  checkSPDXCompliance(generateOutputOn);
  const bannedLicenses = generateSPDXExpression(failOn);
  const generateOutputOnLicenses = generateSPDXExpression(generateOutputOn);

  const packages = await checker.parsePackages(args.start);
  const packageList = getPackageInfoList(packages);

  const { forbidden: forbiddenPackages, nonCompliant: invalidPackages } = checkPackagesLicenses(bannedLicenses, packageList);
  if (invalidPackages.length) {
    console.info(`The following package licenses are not SPDX compliant and cannot be validated:\n${invalidPackages.map(pkg => ` > ${pkg.package} | ${pkg.licenses}`).join('\n')}`);
  }

  if (forbiddenPackages.length) {
    reporter.writeErrorReportFile(args.errorReportFileName, forbiddenPackages);
    throw new Error(formatForbiddenLicenseError(forbiddenPackages));
  }

  console.info('License check completed! No forbidden licenses packages found.');

  if (args.disableReport) return;

  const { forbidden: packagesIncludeOutputLicenses } = checkPackagesLicenses(generateOutputOnLicenses, packageList);
  if (generateOutputOnLicenses && !packagesIncludeOutputLicenses.length) return;

  reporter.writeReportFile(args.outputFileName, packageList, args.customHeader);
};

module.exports = {
  run
};

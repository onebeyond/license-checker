const isSPDXCompliant = require('spdx-expression-validate');
const satisfiesSPDXLicense = require('spdx-satisfies');

const {
  getPackageInfoList, formatForbiddenLicenseError
} = require('./utils');

const checkLicenseArgument = arg => {
  if (arg && !isSPDXCompliant(arg)) {
    throw new Error(`The argument "${arg}" is not SPDX compliant. Please, use the --checkLicense option to validate your input`);
  }
};

const checkPackagesLicenses = (inputLicenses, packages) => packages.reduce((total, pkg) => {
  const { licenses } = pkg;
  if (!isSPDXCompliant(licenses)) return { ...total, warning: [...total.warning, pkg] };
  if (inputLicenses && satisfiesSPDXLicense(inputLicenses, licenses)) return { ...total, error: [...total.error, pkg] };
  return total;
}, { error: [], warning: [] });

const run = async (checker, reporter, args) => {
  if (args.checkLicense) {
    const license = args.checkLicense;
    if (!isSPDXCompliant(license)) {
      throw new Error(`Error: License "${license}" is not SPDX compliant. Please visit https://spdx.org/licenses/ for the full list`);
    }
    console.info(`License ${license} is SPDX compliant`);
    return;
  }

  const { failOn: bannedLicenses, generateOutputOn: generateOutputOnLicenses } = args;
  checkLicenseArgument(bannedLicenses);
  checkLicenseArgument(generateOutputOnLicenses);

  const packages = await checker.parsePackages(args.start);

  const packageList = getPackageInfoList(packages);

  const { error: forbiddenPackages, warning: invalidPackages } = checkPackagesLicenses(bannedLicenses, packageList);
  if (invalidPackages.length) {
    console.info(`The following package licenses are not SPDX compliant and cannot be validated:\n${invalidPackages.map(pkg => ` > ${pkg.package} | ${pkg.licenses}`).join('\n')}`);
  }

  if (forbiddenPackages.length) {
    reporter.writeErrorReportFile(args.errorReportFileName, forbiddenPackages);
    throw new Error(formatForbiddenLicenseError(forbiddenPackages));
  }

  console.info('License check completed! No forbidden licenses packages found.');

  if (args.disableReport) return;
  const { error: packagesIncludeOutputLicenses } = checkPackagesLicenses(generateOutputOnLicenses, packageList);
  if (generateOutputOnLicenses && !packagesIncludeOutputLicenses.length) return;
  reporter.writeReportFile(args.outputFileName, packageList, args.customHeader);
};

module.exports = {
  run
};

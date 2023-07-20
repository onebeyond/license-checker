const isSPDXCompliant = require('spdx-expression-validate');

const checker = require('./checker');
const reporter = require('./reporter');

const {
  getPackageInfoList, formatForbiddenLicenseError, generateSPDXExpression, checkSPDXCompliance, checkPackagesLicenses, isLicenseError, checkLicenseError
} = require('./utils');

const check = (license) => {
  if (!license) throw new Error('Error: You must provide a license to check.');

  // @TODO Remove after issue has been solved
  if (isLicenseError(license)) {
    throw new Error(
      'GFDL-1.x licenses are temporary unallowed. There\'s an issue pending to be solved. 🙏'
    );
  }

  if (!isSPDXCompliant(license)) {
    throw new Error(`Error: License "${license}" is not SPDX compliant. Please visit https://spdx.org/licenses/ for the full list of valid licenses.`);
  }

  console.info(`License ${license} is SPDX compliant`);
};

const scan = async (options) => {
  const { failOn } = options;

  if (!failOn) throw new Error('Error: You must provide a list of licenses to fail on in the "failOn" option.');

  checkLicenseError(failOn); // @TODO Remove after issue has been solved
  checkSPDXCompliance(failOn);
  const bannedLicenses = generateSPDXExpression(failOn);

  const packages = await checker.parsePackages(options.start);
  const packageList = getPackageInfoList(packages);

  const { forbidden: forbiddenPackages, nonCompliant: invalidPackages } = checkPackagesLicenses(bannedLicenses, packageList);
  if (invalidPackages.length) {
    console.info(`The following package licenses are not SPDX compliant and cannot be validated:\n${invalidPackages.map(pkg => ` > ${pkg.package} | ${pkg.licenses}`).join('\n')}`);
  }

  if (forbiddenPackages.length) {
    reporter.writeErrorReportFile(options.errorReportFileName, forbiddenPackages);
    throw new Error(formatForbiddenLicenseError(forbiddenPackages));
  }

  console.info('License check completed! No forbidden licenses packages found.');

  if (options.disableReport) return;

  reporter.writeReportFile(options.outputFileName, packageList, options.customHeader);
};

module.exports = {
  check,
  scan
};

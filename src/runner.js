const isSPDXCompliant = require('spdx-expression-validate');

const checker = require('./checker');
const reporter = require('./reporter');
const logger = require('./logger');
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

  logger.info(`License ${license} is SPDX compliant`);
};

const scan = async (options) => {
  const { failOn, allowOnly } = options;

  const allowSelected = !!allowOnly;
  const licensesList = allowSelected ? allowOnly : failOn;

  checkLicenseError(licensesList); // @TODO Remove after issue has been solved
  checkSPDXCompliance(licensesList);
  const spdxLicensesExpression = generateSPDXExpression(licensesList);

  const packages = await checker.parsePackages(options.start);
  const packageList = getPackageInfoList(packages);

  const {
    forbidden: forbiddenPackages,
    nonCompliant: invalidPackages
  } = checkPackagesLicenses(spdxLicensesExpression, packageList, allowSelected);
  if (invalidPackages.length) {
    logger.warn(`The following package licenses are not SPDX compliant and cannot be validated:\n${invalidPackages.map(pkg => ` > ${pkg.package} | ${pkg.licenses}`).join('\n')}`);
  }

  if (forbiddenPackages.length) {
    if (!options.disableErrorReport) reporter.writeErrorReportFile(options.errorReportFileName, forbiddenPackages);
    throw new Error(formatForbiddenLicenseError(forbiddenPackages));
  }

  logger.info('License check completed! No forbidden licenses packages found.');

  if (options.disableReport) return;

  reporter.writeReportFile(options.outputFileName, packageList, options.customHeader);
};

module.exports = {
  check,
  scan
};

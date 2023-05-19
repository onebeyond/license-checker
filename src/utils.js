const isSPDXCompliant = require('spdx-expression-validate');
const satisfiesSPDXLicense = require('spdx-satisfies');

/**
 * Generate objects with information on each package that we want to include
 * in the report files. This will include metadata such as the package name,
 * author or license name, among others.
 *
 *  The fields `path` and `licenseFile` will be excluded from the output.
 *
 * @param {object} packages - Map of packages installed in the project where
 *  the script is run
 *
 * @returns List of objects with package metadata
 */
const getPackageInfoList = packages => Object.entries(packages)
  .map(([key, value]) => {
    const { path, licenseFile, ...rest } = value;
    const validInfo = {
      package: key,
      ...rest
    };

    return validInfo;
  });

/**
 * Format the forbidden licenses identified in a multiline string
 *
 * @param {object[]} licenses - List of licenses identified
 * @returns {string} - A string with the number and list of forbidden licenses identified
 */
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

/**
 * Generates a SPDX expression joining the input licenses with the OR operator
 * @param {string[]} licenses - List of SPDX licenses
 * @return {string} - A string with the input licenses joined with the OR operator.
 * e.g. input -> ['MIT', 'GPL-1.0'] output -> 'MIT OR GPL-1.0'
 */
const generateSPDXExpression = (licenses = []) => licenses.join(' OR ');

/**
 * Checks whether the input licenses are SPDX compliant. Throws an error with the invalid licenses
 * @param licenses - List of licenses
 */
const checkSPDXCompliance = (licenses = []) => {
  const invalidLicenses = licenses.filter(arg => !isSPDXCompliant(arg));
  if (invalidLicenses.length) {
    throw new Error(
      `The following licenses are not SPDX compliant. Please, use the --checkLicense option to validate your input:\n${invalidLicenses.join(' | ')}`
    );
  }
};

/**
 * Checks the SPDX expression against the list of packages. If the license of the package itself is not SPDX compliant, the package will
 * be included on the "nonCompliant" list. If the SPDX expression satisfies the package license, the package will be included on the
 * "satisfied" list
 * @param {string} expression - A SPDX expression
 * @param {object[]} packages - A list of packages to be checked against the SPDX expression
 * @return {{satisfied: object[], nonCompliant: object[]}} - A couple of lists including the packages that satisfy the SPDX expression
 * and the packages with a non SPDX compliant license
 */
const checkPackagesLicenses = (expression, packages) => packages.reduce((total, pkg) => {
  const { licenses } = pkg;
  if (!isSPDXCompliant(licenses)) return { ...total, nonCompliant: [...total.nonCompliant, pkg] };
  if (expression && satisfiesSPDXLicense(expression, licenses)) return { ...total, satisfied: [...total.satisfied, pkg] };
  return total;
}, { satisfied: [], nonCompliant: [] });

module.exports = {
  getPackageInfoList,
  formatForbiddenLicenseError,
  generateSPDXExpression,
  checkSPDXCompliance,
  checkPackagesLicenses
};

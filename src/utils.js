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
 * Parses failOn arguments distinguishing between plain string and
 * regex like strings
 *
 * @param {string[]} args - List of arguments to parse
 * @returns {{invalid: (string|RegExp)[], valid: (string|RegExp)[]}} - List of valid
 * and invalid parsed arguments. The invalid object will include unsuccessful parsed regex
 */
const parseFailOnArgs = args => args.reduce((total, arg) => {
  try {
    const pattern = (/^\/(?<pattern>.+)\/$/.exec(arg) || { groups: {} }).groups.pattern;
    return { ...total, valid: [...total.valid, pattern ? new RegExp(pattern) : arg] };
  } catch (e) {
    return { ...total, invalid: [...total.invalid, arg] };
  }
}, { valid: [], invalid: [] });

/**
 * Tests if the license argument is equal to or matches the expression argument
 *
 * @param {string} license - License to check
 * @param {string|RegExp} expression - The expression the license will be tested against
 * @returns {boolean} - Result of the test
 */
const licenseMatchesExpression = (license, expression) => {
  if (expression instanceof RegExp) return expression.test(license);
  return license === expression;
};

/**
 * Extracts the invalid packages according to the provided list of licenses
 *
 * @param {(string|RegExp)[]} failOnArgs - List of arguments to parse
 * @param {object[]} packages - List of packages
 * @returns {object[]} - List of invalid packages
 */
const extractInvalidPackages = (failOnArgs, packages) => packages
  .filter(({ licenses }) => failOnArgs.some(arg => licenseMatchesExpression(licenses, arg)));

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

module.exports = {
  getPackageInfoList,
  extractInvalidPackages,
  parseFailOnArgs,
  formatForbiddenLicenseError
};

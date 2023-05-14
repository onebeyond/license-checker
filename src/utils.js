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

module.exports = {
  getPackageInfoList,
  formatForbiddenLicenseError
};

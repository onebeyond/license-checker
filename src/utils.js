const fs = require('fs');
const _ = require('lodash');

const defaultReportHeader = 'This application makes use of the following open source packages:';

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
 *  Generates a table in markdown format with information on the installed
 * packages, including their licenses.
 *
 * @param {object[]} packageList - List of packages to be dumped inside of the file
 */
const buildPackageTable = packageList => {
  const tableHeader = '\n| Library | Version | License | Repository |\n|---|---|---|---|\n';

  const compiled = _.template(
    `${tableHeader}<% _.forEach(report, elem => { const r = /(.*)@(.*)/.exec(elem.package); %>| <%- r[1] %> | <%- r[2] %> | <%- elem.licenses %> | <%- elem.repository %> |\n<% }); %>`
  );

  return compiled({ report: packageList });
};

/**
 * Generate report file.
 *
 * @param {string} outputFileName - Name of the file for the generated report
 * @param {object[]} packageList - List of packages to be dumped inside of the file
 * @param {string} customHeaderFileName - Name of the file that contains the custom header
 *  to add at the beginning of the generated report
 */
const writeReportFile = (outputFileName, packageList, customHeaderFileName) => {
  let licenseReportHeader = defaultReportHeader;
  if (customHeaderFileName) {
    try {
      licenseReportHeader = fs.readFileSync(customHeaderFileName);
    } catch {
      console.warn(`Failed to read file ${customHeaderFileName}, so default header will be added to the report`);
    }
  }

  const licenseTable = buildPackageTable(packageList);

  fs.writeFileSync(
    `${outputFileName}.md`,
    `${licenseReportHeader}\n${licenseTable}`,
    error => {
      if (error) {
        console.error(`Error generating report file ${outputFileName}.md`);
        throw error;
      }
    }
  );

  console.info(`${outputFileName}.md created!`);
};

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
    const pattern = /^\/(?<pattern>.+)\/$/.exec(arg)?.groups?.pattern;
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
const checkInvalidLicense = (license, expression) => {
  const check = {
    string: () => license === expression,
    object: () => expression.test(license)
  };
  const typeOfExpression = typeof expression;
  return check[typeOfExpression]();
};

/**
 * Extracts the invalid packages according to the provided list of licenses
 *
 * @param {(string|RegExp)[]} failOnArgs - List of arguments to parse
 * @param {object[]} packages - List of packages
 * @returns {object[]} - List of invalid packages
 */
const extractInvalidPackages = (failOnArgs, packages) => packages
  .filter(({ licenses }) => failOnArgs.some(arg => checkInvalidLicense(licenses, arg)));

module.exports = {
  getPackageInfoList,
  writeReportFile,
  extractInvalidPackages,
  parseFailOnArgs
};

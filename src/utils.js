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
    `${tableHeader}<% _.forEach(report, elem => { const r = /(.*)@(.*)/.exec(elem.package); %>| <%- r[1] %> | <%- r[2] %> | <%- elem.licenses %> | <%- elem.repository %> |\n<% }); %>`,
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
      console.error(`Failed to read file ${customHeaderFileName}, so default header will be added to the report`);
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
    },
  );

  console.info(`${outputFileName}.md created!`);
};

module.exports = {
  getPackageInfoList,
  writeReportFile
};

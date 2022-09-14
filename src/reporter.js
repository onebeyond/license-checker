const _ = require('lodash');
const fs = require('fs');

const defaultReportHeader = 'This application makes use of the following open source packages:';
const errorReportHeader = 'The following packages use invalid licenses:';

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
 * @param {string} header - Value to be used as header of the generated file
 * @returns {function}
 */
const writeReportFile = header =>
  /**
   * Generate report file.
   *
   * @param {string} outputFileName - Name of the file for the generated report
   * @param {object[]} packageList - List of packages to be dumped inside the file
   * @param {string} customHeaderFileName - Name of the file that contains the custom header
   *  to add at the beginning of the generated report
   */
  (outputFileName, packageList, customHeaderFileName) => {
    let licenseReportHeader = header;
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

module.exports = {
  writeReportFile: writeReportFile(defaultReportHeader),
  writeErrorReportFile: writeReportFile(errorReportHeader)
};

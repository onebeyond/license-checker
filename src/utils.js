const fs = require('fs');
const _ = require('lodash');

const licenseReportHeader = 'This application makes use of the following open source packages:\n\n| Library | Version | License | Repository |\n|---|---|---|---|\n';

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
      ...rest,
    };

    return validInfo;
  });

/**
 * Generate report file.
 *
 * @param {string} outputFileName - Name of the file for the generated report
 * @param {object[]} packageList - List of packages to be dumped inside of the file
 */
const writeReportFile = (outputFileName, packageList) => {
  const compiled = _.template(
    `${licenseReportHeader}<% _.forEach(report, elem => { const r = /(.*)@(.*)/.exec(elem.package); %>| <%- r[1] %> | <%- r[2] %> | <%- elem.licenses %> | <%- elem.repository %> |\n<% }); %>`,
  );

  const output = compiled({ 'report': packageList });
  fs.writeFileSync(
    `${outputFileName}.md`,
    output, error => {
      if (error) {
        console.error(`Error generating report file ${outputFileName}.md`)
        throw error;
      }
    });
  console.info(`${outputFileName}.md created!`);
};


module.exports = {
  getPackageInfoList,
  writeReportFile,
};

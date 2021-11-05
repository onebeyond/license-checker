const fs = require('fs');
const _ = require('lodash');

const licenseReportHeader = 'This application makes use of the following open source packages:\n\n| Library | Version | License | Repository |\n|---|---|---|---|\n';
const licenses = ['0BSD', 'Apache-2.0', 'Apache-1.0', 'MIT', 'ISC', 'BSD-Source-Code', 'WTFPL', 'CC0-1.0', 'GPL', 'LGPL'];
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

const getAllCorrectLicenses = (licenseRegex) =>
  licenses.reduce((acc, correctLicense) => {
      if (licenseRegex.test(correctLicense)) return [...acc, correctLicense];

      return acc;
    }, []).flat();

const isValidLicense = (license) => licenses.includes(license)

const transformLicense = (license) => {

  if(isValidLicense(license)) return license;

  const licenseRegex = new RegExp(license, 'i');

  return license + ',' + getAllCorrectLicenses(licenseRegex);
}

/**
 * Check if all licenses insert by user are correct, 
 * those who aren't will be tested and when a matching 
 * license is found it will be added in the string.
 * 
 * @param  {object} argv - arguments
 * 
 * @returns arguments
 */
const checkIfLicenseAreCorrect = (argv) => {
  argv.failOn = argv.failOn
    .split(",")
    .map(transformLicense)
    .join(",");

  return argv;
};


module.exports = {
  getPackageInfoList,
  writeReportFile,
  checkIfLicenseAreCorrect,
};

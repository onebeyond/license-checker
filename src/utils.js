const fs = require('fs');

/**
 *  Generate objects with information on each package that we want to include
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
 *  Generate report file in JSON format.
 *
 * @param {string} outputFileName - Name of the file that will be written
 * @param {object[]} outputData - Data to write inside of the file
 */
const writeReportFile = (outputFileName, outputData = []) => {
  fs.writeFileSync(
    `${outputFileName}.txt`,
    JSON.stringify(outputData, null, '\t'), error => {
      if (error) throw error;
    });

  console.info(`${outputFileName}.txt created!`);
};

module.exports = {
  getPackageInfoList,
  writeReportFile,
};

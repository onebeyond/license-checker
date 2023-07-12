const yargs = require('yargs');

let timestamp = new Date().toISOString();

// Colon in filenames is not supported in Windows, so we must replace them
if (process.platform === 'win32') {
  timestamp = timestamp.replace(/:/gi, '.');
}

/**
 *  Definition of all of the different arguments that can be passed to the
 * license checker utility via CLI.
 */
module.exports = yargs
  .option('start', {
    description: 'path of the initial json to look for',
    type: 'string',
    default: process.cwd()
  })
  .option('failOn', {
    description: 'fail (exit with code 1) if any package license does not satisfies any license in the provided list',
    type: 'array'
  })
  .option('outputFileName', {
    description: 'name of the output file generated',
    type: 'string',
    default: `license-report-${timestamp}`
  })
  .option('errorReportFileName', {
    description: 'name of the file generated when a license in the failOn option is found',
    type: 'string',
    default: `license-error-${timestamp}`
  })
  .option('disableErrorReport', {
    description: 'flag to disable the error report file generation',
    type: 'boolean',
    default: false
  })
  .option('disableReport', {
    description: 'flag to disable the report file generation, whether there is an error or not',
    type: 'boolean',
    default: false
  })
  .option('customHeader', {
    description: 'name of a text file containing the custom header to add at the start of the generated report',
    type: 'string'
  })
  .option('checkLicense', {
    description: 'check if a license is SPDX compliant. It is intended to be used as a standalone command. More info at https://spdx.org/licenses/',
    type: 'string',
    default: false
  })
  .help()
  .alias('help', 'h')
  .argv;

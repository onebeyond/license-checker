const { scan } = require('../src/runner');

let timestamp = new Date().toISOString();

// Colon in filenames is not supported in Windows, so we must replace them
if (process.platform === 'win32') {
  timestamp = timestamp.replace(/:/gi, '.');
}

exports.command = ['scan', '$0'];

exports.describe = 'scan licenses of a project looking for forbidden licenses';

exports.builder = {
  start: {
    description: 'path of the initial json to look for',
    type: 'string',
    default: process.cwd()
  },
  failOn: {
    description: 'fail (exit with code 1) if any package license does not satisfies any license in the provided list',
    type: 'array',
    demandOption: true
  },
  outputFileName: {
    description: 'name of the output file generated',
    type: 'string',
    default: `license-report-${timestamp}`
  },
  errorReportFileName: {
    description: 'name of the file generated when a license in the failOn option is found',
    type: 'string',
    default: `license-error-${timestamp}`
  },
  disableErrorReport: {
    description: 'flag to disable the error report file generation',
    type: 'boolean',
    default: false
  },
  disableReport: {
    description: 'flag to disable the report file generation, whether there is an error or not',
    type: 'boolean',
    default: false
  },
  customHeader: {
    description: 'name of a text file containing the custom header to add at the start of the generated report',
    type: 'string'
  }
};

exports.handler = async function (argv) {
  const { _, $0, ...options } = argv;

  try {
    await scan(options);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
};

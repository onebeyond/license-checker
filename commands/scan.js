import { scan } from '../src/runner.js';
import logger from '../src/logger.js';

let timestamp = new Date().toISOString();

// Colon in filenames is not supported in Windows, so we must replace them
if (process.platform === 'win32') {
  timestamp = timestamp.replace(/:/gi, '.');
}

export const command = ['scan', '$0'];

export const describe = 'scan licenses of a project looking for forbidden licenses';

export const builder = {
  start: {
    description: 'path of the initial json to look for',
    type: 'string',
    default: process.cwd()
  },
  failOn: {
    description: 'fail (exit with code 1) if at least one package license satisfies one of the licenses in the provided list ',
    type: 'array',
    conflicts: 'allowOnly'
  },
  allowOnly: {
    description: 'fail (exit with code 1) if at least one package license does not satisfy one of the licenses in the provided list',
    type: 'array',
    conflicts: 'failOn'
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

export const handler = async function (argv) {
  const { _, $0, ...options } = argv;

  try {
    await scan(options);
  } catch (e) {
    logger.error(e.message);
    process.exit(1);
  }
};

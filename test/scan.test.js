jest.mock('../src/checker');
jest.mock('../src/reporter');

const { scan } = require('../src/runner');
const logger = require('../src/logger');
const { parsePackages } = require('../src/checker');
const { writeErrorReportFile, writeReportFile } = require('../src/reporter');

describe('scan command', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('command arguments validation', () => {
    it('should return an error if any of the licenses provided to the "failOn" argument are not SPDX compliant', async () => {
      const options = {
        failOn: ['MIT', 'GPL', 'BSD']
      };

      let error;
      try {
        await scan(options);
      } catch (e) {
        error = e;
      } finally {
        expect(error.message).toBe('The following licenses are not SPDX compliant. Please, use the "check" command to validate your input:\nGPL | BSD');
      }
    });

    it('should return an error if any of the licenses provided to the "failOn" argument are affected by the temporal issue', async () => {
      const options = {
        failOn: ['MIT', 'GPL', 'GFDL-1.1-invariants-or-later']
      };

      let error;
      try {
        await scan(options);
      } catch (e) {
        error = e;
      } finally {
        expect(error.message).toBe("Your licenses list contains a GFDL-1.x licenses and they are temporary unallowed. There's an issue pending to solve.");
      }
    });
  });

  describe('command execution output', () => {
    describe('"failOn" option', () => {
      it('should call the checker passing the path to the working directory', async () => {
        const options = {
          start: '/path/to/cwd',
          failOn: ['MIT']
        };

        const packages = {
          'package-1': {
            licenses: 'GPL-1.0+',
            repository: 'https://git.com/repo/repo',
            path: '/path/to/package',
            licenseFile: '/path/to/package/LICENSE'
          }
        };

        parsePackages.mockResolvedValueOnce(packages);

        await scan(options);

        expect(parsePackages).toHaveBeenCalledWith(options.start);
      });

      it('should print a message if any of the packages\' licenses are not SPDX compliant', async () => {
        const options = {
          start: '/path/to/cwd',
          failOn: ['MIT']
        };

        const packages = {
          'package-1': {
            licenses: 'GPL',
            repository: 'https://git.com/repo/repo',
            path: '/path/to/package',
            licenseFile: '/path/to/package/LICENSE'
          }
        };

        parsePackages.mockResolvedValueOnce(packages);

        const errorSpy = jest.spyOn(logger, 'warn');

        await scan(options);

        expect(errorSpy).toHaveBeenCalledWith(
          `The following package licenses are not SPDX compliant and cannot be validated:\n > ${Object.keys(packages)[0]} | ${packages['package-1'].licenses}`
        );
      });

      it('should throw an error if any packages\' licenses satisfies the "failOn" argument', async () => {
        const options = {
          start: '/path/to/cwd',
          failOn: ['MIT', 'GPL-1.0+']
        };

        const packages = {
          'package-1': {
            licenses: 'MIT',
            repository: 'https://git.com/repo/repo',
            path: '/path/to/package',
            licenseFile: '/path/to/package/LICENSE'
          }
        };

        parsePackages.mockResolvedValueOnce(packages);

        let error;
        try {
          await scan(options);
        } catch (e) {
          error = e;
        } finally {
          expect(error.message).toBe('Found 1 packages with licenses defined by the provided option:\n > 1 packages with license MIT');
        }
      });

      it('should not throw an error if one of the licences in a package joined by the operator OR contains one of the licences in the "failOn" argument', async () => {
        const options = {
          start: '/path/to/cwd',
          failOn: ['MIT', 'GPL-1.0+']
        };

        const packages = {
          'package-1': {
            licenses: 'MIT OR Apache-2.0',
            repository: 'https://git.com/repo/repo',
            path: '/path/to/package',
            licenseFile: '/path/to/package/LICENSE'
          }
        };

        let error;

        parsePackages.mockResolvedValueOnce(packages);
        try {
          await scan(options);
        } catch (err) {
          error = err;
        } finally {
          expect(error).toBeUndefined();
        }
      });

      it('should not throw an error if one of the licences in a package joined by the operator AND does not contain any licences in the "failOn" argument', async () => {
        const options = {
          start: '/path/to/cwd',
          failOn: ['GPL-1.0+']
        };

        const packages = {
          'package-1': {
            licenses: 'MIT AND Apache-2.0',
            repository: 'https://git.com/repo/repo',
            path: '/path/to/package',
            licenseFile: '/path/to/package/LICENSE'
          }
        };

        parsePackages.mockResolvedValueOnce(packages);

        let error;
        try {
          await scan(options);
        } catch (err) {
          error = err;
        } finally {
          expect(error).toBeUndefined();
        }
      });

      it('should throw an error if any packages\' licenses joined by the AND operator satisfies the "failOn" argument', async () => {
        const options = {
          start: '/path/to/cwd',
          failOn: ['GPL-1.0+', 'MIT']
        };

        const packages = {
          'package-1': {
            licenses: 'MIT AND Apache-2.0',
            repository: 'https://git.com/repo/repo',
            path: '/path/to/package',
            licenseFile: '/path/to/package/LICENSE'
          }
        };

        parsePackages.mockResolvedValueOnce(packages);

        let error;
        try {
          await scan(options);
        } catch (err) {
          error = err;
        } finally {
          expect(error.message).toBe('Found 1 packages with licenses defined by the provided option:\n > 1 packages with license MIT AND Apache-2.0');
        }
      });
    });

    describe('"allowOnly" option', () => {
      it('should call the checker passing the path to the working directory', async () => {
        const options = {
          start: '/path/to/cwd',
          allowOnly: ['MIT']
        };

        const packages = {
          'package-1': {
            licenses: 'MIT',
            repository: 'https://git.com/repo/repo',
            path: '/path/to/package',
            licenseFile: '/path/to/package/LICENSE'
          }
        };

        parsePackages.mockResolvedValueOnce(packages);

        await scan(options);

        expect(parsePackages).toHaveBeenCalledWith(options.start);
      });

      it('should print a message if any of the packages\' licenses are not SPDX compliant', async () => {
        const options = {
          start: '/path/to/cwd',
          allowOnly: ['MIT']
        };

        const packages = {
          'package-1': {
            licenses: 'GPL',
            repository: 'https://git.com/repo/repo',
            path: '/path/to/package',
            licenseFile: '/path/to/package/LICENSE'
          }
        };

        parsePackages.mockResolvedValueOnce(packages);

        const errorSpy = jest.spyOn(logger, 'warn');

        await scan(options);

        expect(errorSpy).toHaveBeenCalledWith(
          `The following package licenses are not SPDX compliant and cannot be validated:\n > ${Object.keys(packages)[0]} | ${packages['package-1'].licenses}`
        );
      });

      it('should throw an error if none packages\' licenses satisfy the "allowOnly" argument', async () => {
        const options = {
          start: '/path/to/cwd',
          allowOnly: ['MIT', 'GPL-1.0+']
        };

        const packages = {
          'package-1': {
            licenses: 'OpenSSL',
            repository: 'https://git.com/repo/repo',
            path: '/path/to/package',
            licenseFile: '/path/to/package/LICENSE'
          }
        };

        parsePackages.mockResolvedValueOnce(packages);

        let error;
        try {
          await scan(options);
        } catch (e) {
          error = e;
        } finally {
          expect(error.message).toBe('Found 1 packages with licenses defined by the provided option:\n > 1 packages with license OpenSSL');
        }
      });

      it('should not throw an error if one of the licences in a package joined by the operator OR contains one of the licences in the "allowOnly" arguments', async () => {
        const options = {
          start: '/path/to/cwd',
          allowOnly: ['MIT', 'Apache-2.0']
        };

        const packages = {
          'package-1': {
            licenses: 'MIT OR Apache-2.0',
            repository: 'https://git.com/repo/repo',
            path: '/path/to/package',
            licenseFile: '/path/to/package/LICENSE'
          },
          'package-2': {
            licenses: 'GPL-1.0+ OR Apache-2.0',
            repository: 'https://git.com/repo/repo',
            path: '/path/to/package',
            licenseFile: '/path/to/package/LICENSE'
          }
        };

        let error;

        parsePackages.mockResolvedValueOnce(packages);
        try {
          await scan(options);
        } catch (err) {
          error = err;
        } finally {
          expect(error).toBeUndefined();
        }
      });

      it('should not throw an error if one of the licences in a package joined by the operator AND contains all licences in the "allowOnly" arguments', async () => {
        const options = {
          start: '/path/to/cwd',
          allowOnly: ['MIT AND Apache-2.0']
        };

        const packages = {
          'package-1': {
            licenses: 'MIT AND Apache-2.0',
            repository: 'https://git.com/repo/repo',
            path: '/path/to/package',
            licenseFile: '/path/to/package/LICENSE'
          }
        };

        parsePackages.mockResolvedValueOnce(packages);

        let error;
        try {
          await scan(options);
        } catch (err) {
          error = err;
        } finally {
          expect(error).toBeUndefined();
        }
      });

      it('should throw an error if any packages\' licenses joined by the AND operator does not satisfy the "allowOnly" argument', async () => {
        const options = {
          start: '/path/to/cwd',
          allowOnly: ['MIT']
        };

        const packages = {
          'package-1': {
            licenses: 'MIT AND Apache-2.0',
            repository: 'https://git.com/repo/repo',
            path: '/path/to/package',
            licenseFile: '/path/to/package/LICENSE'
          }
        };

        parsePackages.mockResolvedValueOnce(packages);

        let error;
        try {
          await scan(options);
        } catch (err) {
          error = err;
        } finally {
          expect(error.message).toBe('Found 1 packages with licenses defined by the provided option:\n > 1 packages with license MIT AND Apache-2.0');
        }
      });
    });
  });

  describe('error report file', () => {
    it('should not call the reporter to generate the error file if none of the packages\' licenses satisfy the "failOn" argument', async () => {
      const options = {
        start: '/path/to/cwd',
        failOn: ['MIT', '0BSD']
      };

      const packages = {
        'package-1': {
          licenses: 'GPL-1.0-only',
          repository: 'https://git.com/repo/repo',
          path: '/path/to/package',
          licenseFile: '/path/to/package/LICENSE'
        }
      };

      parsePackages.mockResolvedValueOnce(packages);

      await scan(options);

      expect(writeErrorReportFile).not.toHaveBeenCalled();
    });

    it('should call the reporter to generate the error report if any packages\' licenses satisfy the "failOn" argument', async () => {
      const options = {
        start: '/path/to/cwd',
        failOn: ['MIT', 'GPL-1.0+'],
        errorReportFileName: 'error_file_name'
      };

      const packages = {
        'package-1': {
          licenses: 'MIT',
          repository: 'https://git.com/repo/repo',
          path: '/path/to/package',
          licenseFile: '/path/to/package/LICENSE'
        }
      };

      parsePackages.mockResolvedValueOnce(packages);

      try {
        await scan(options);
      } catch (e) {
        //
      } finally {
        expect(writeErrorReportFile).toHaveBeenCalledWith(
          options.errorReportFileName,
          [{ licenses: packages['package-1'].licenses, package: Object.keys(packages)[0], repository: packages['package-1'].repository }]
        );
      }
    });

    it('should not call the reporter to generate the error report file if the option "disableErrorReport" is enabled', async () => {
      const options = {
        start: '/path/to/cwd',
        failOn: ['GPL-1.0+'],
        disableErrorReport: true
      };

      const packages = {
        'package-1': {
          licenses: 'GPL-1.0',
          repository: 'https://git.com/repo/repo',
          path: '/path/to/package',
          licenseFile: '/path/to/package/LICENSE'
        }
      };

      parsePackages.mockResolvedValueOnce(packages);

      let error;
      try {
        await scan(options);
      } catch (err) {
        error = err;
      } finally {
        expect(error.message).toBe('Found 1 packages with licenses defined by the provided option:\n > 1 packages with license GPL-1.0');
        expect(writeErrorReportFile).not.toHaveBeenCalled();
      }
    });
  });

  describe('licenses report file', () => {
    it('should not call the reporter to generate the report file if the option "disableReport" is supplied', async () => {
      const options = {
        start: '/path/to/cwd',
        failOn: ['MIT'],
        disableReport: true
      };

      const packages = {
        'package-1': {
          licenses: 'GPL-1.0',
          repository: 'https://git.com/repo/repo',
          path: '/path/to/package',
          licenseFile: '/path/to/package/LICENSE'
        }
      };

      parsePackages.mockResolvedValueOnce(packages);

      await scan(options);

      expect(writeReportFile).not.toHaveBeenCalled();
    });

    it('should call the reporter to generate the report file', async () => {
      const options = {
        start: '/path/to/cwd',
        failOn: ['MIT']
      };

      const packages = {
        'package-1': {
          licenses: 'GPL-1.0',
          repository: 'https://git.com/repo/repo',
          path: '/path/to/package',
          licenseFile: '/path/to/package/LICENSE'
        }
      };

      parsePackages.mockResolvedValueOnce(packages);

      await scan(options);

      expect(writeReportFile).toHaveBeenCalled();
    });

    it('should call the reporter with the right arguments', async () => {
      const options = {
        start: '/path/to/cwd',
        failOn: ['MIT'],
        outputFileName: 'outputFileName',
        customHeader: 'customHeader'
      };

      const packages = {
        'package-1': {
          licenses: 'GPL-1.0',
          repository: 'https://git.com/repo/repo',
          path: '/path/to/package',
          licenseFile: '/path/to/package/LICENSE'
        }
      };

      parsePackages.mockResolvedValueOnce(packages);

      await scan(options);

      expect(writeReportFile).toHaveBeenCalledWith(
        options.outputFileName,
        [{ licenses: packages['package-1'].licenses, package: Object.keys(packages)[0], repository: packages['package-1'].repository }],
        options.customHeader
      );
    });
  });
});

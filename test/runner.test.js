const runner = require('../src/runner');

describe('Runner', () => {
  const checker = {
    parsePackages: jest.fn()
  };

  const reporter = {
    writeErrorReportFile: jest.fn(),
    writeReportFile: jest.fn()
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('When the checkLicense argument is present', () => {
    it('should throw an error if the "checkLicense" argument is not SPDX compliant', async () => {
      const args = {
        checkLicense: 'GPL'
      };

      let error;
      try {
        await runner.run(checker, reporter, args);
      } catch (e) {
        error = e;
      } finally {
        expect(error.message).toMatch(`Error: License "${args.checkLicense}" is not SPDX compliant`);
      }
    });

    it('should not throw if the "checkLicense" argument is SPDX compliant', async () => {
      const args = {
        checkLicense: 'MIT'
      };

      let error;
      try {
        await runner.run(checker, reporter, args);
      } catch (e) {
        error = e;
      } finally {
        expect(error).toBeUndefined();
      }
    });

    it('should not scan the packages\' licenses if the "checkLicense" argument is provided', async () => {
      const args = {
        checkLicense: 'MIT'
      };

      await runner.run(checker, reporter, args);

      expect(checker.parsePackages).not.toHaveBeenCalled();
    });
  });

  describe('Check arguments', () => {
    it('should return an error if the "failOn" argument is not SPDX compliant', async () => {
      const args = {
        failOn: 'GPL'
      };

      let error;
      try {
        await runner.run(checker, reporter, args);
      } catch (e) {
        error = e;
      } finally {
        expect(error.message).toMatch(`The argument "${args.failOn}" is not SPDX compliant`);
      }
    });

    it('should return an error if the "generateOutputOn" argument is not SPDX compliant', async () => {
      const args = {
        generateOutputOn: 'GPL'
      };

      let error;
      try {
        await runner.run(checker, reporter, args);
      } catch (e) {
        error = e;
      } finally {
        expect(error.message).toMatch(`The argument "${args.generateOutputOn}" is not SPDX compliant`);
      }
    });
  });

  describe('Scan packages\' licenses', () => {
    it('should call the checker passing the path to the working directory', async () => {
      const args = {
        start: '/path/to/cwd'
      };
      const packages = {
        'package-1': {
          licenses: 'GPL-1.0+',
          repository: 'https://git.com/repo/repo',
          path: '/path/to/package',
          licenseFile: '/path/to/package/LICENSE'
        }
      };

      checker.parsePackages.mockResolvedValueOnce(packages);

      await runner.run(checker, reporter, args);

      expect(checker.parsePackages).toHaveBeenCalledWith(args.start);
    });

    it('should print a message if any of the packages\' licenses are not SPDX compliant', async () => {
      const args = {
        start: '/path/to/cwd'
      };
      const packages = {
        'package-1': {
          licenses: 'GPL',
          repository: 'https://git.com/repo/repo',
          path: '/path/to/package',
          licenseFile: '/path/to/package/LICENSE'
        }
      };

      jest.spyOn(console, 'info');

      checker.parsePackages.mockResolvedValueOnce(packages);

      await runner.run(checker, reporter, args);

      expect(console.info).toHaveBeenCalledWith(
        `The following package licenses are not SPDX compliant and cannot be validated:\n > ${Object.keys(packages)[0]} | ${packages['package-1'].licenses}`
      );
    });

    it('should throw an error if any packages\' licenses satisfy the "failOn" argument', async () => {
      const args = {
        start: '/path/to/cwd',
        failOn: 'MIT'
      };
      const packages = {
        'package-1': {
          licenses: 'MIT',
          repository: 'https://git.com/repo/repo',
          path: '/path/to/package',
          licenseFile: '/path/to/package/LICENSE'
        }
      };

      checker.parsePackages.mockResolvedValueOnce(packages);

      let error;
      try {
        await runner.run(checker, reporter, args);
      } catch (e) {
        error = e;
      } finally {
        expect(error).toBeDefined();
      }
    });
  });

  describe('Error report file', () => {
    it('should not call the reporter to generate the error file if none of the packages\' licenses satisfy the "failOn" argument', async () => {
      const args = {
        start: '/path/to/cwd',
        failOn: 'MIT'
      };
      const packages = {
        'package-1': {
          licenses: 'GPL-1.0',
          repository: 'https://git.com/repo/repo',
          path: '/path/to/package',
          licenseFile: '/path/to/package/LICENSE'
        }
      };

      checker.parsePackages.mockResolvedValueOnce(packages);

      await runner.run(checker, reporter, args);

      expect(reporter.writeErrorReportFile).not.toHaveBeenCalled();
    });

    it('should call the reporter to generate the error report if any packages\' licenses satisfy the "failOn" argument', async () => {
      const args = {
        start: '/path/to/cwd',
        failOn: 'MIT',
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

      checker.parsePackages.mockResolvedValueOnce(packages);

      try {
        await runner.run(checker, reporter, args);
      } catch (e) {
        //
      } finally {
        expect(reporter.writeErrorReportFile).toHaveBeenCalledWith(
          args.errorReportFileName,
          [{ licenses: packages['package-1'].licenses, package: Object.keys(packages)[0], repository: packages['package-1'].repository }]
        );
      }
    });
  });

  describe('Licenses report file', () => {
    it('should not call the reporter to generate the report file if the option "disableReport" is supplied', async () => {
      const args = {
        start: '/path/to/cwd',
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

      checker.parsePackages.mockResolvedValueOnce(packages);

      await runner.run(checker, reporter, args);

      expect(reporter.writeReportFile).not.toHaveBeenCalled();
    });

    it('should not call the reporter to generate the report file if there are no licenses that satisfy the "generateOutputOn" argument', async () => {
      const args = {
        start: '/path/to/cwd',
        generateOutputOn: 'MIT'
      };
      const packages = {
        'package-1': {
          licenses: 'GPL-1.0',
          repository: 'https://git.com/repo/repo',
          path: '/path/to/package',
          licenseFile: '/path/to/package/LICENSE'
        }
      };

      checker.parsePackages.mockResolvedValueOnce(packages);

      await runner.run(checker, reporter, args);

      expect(reporter.writeReportFile).not.toHaveBeenCalled();
    });

    it('should call the reporter to generate the report file if there is at lease on package\'s license that satisfy the "generateOutputOn" argument', async () => {
      const args = {
        start: '/path/to/cwd',
        generateOutputOn: 'GPL-1.0'
      };
      const packages = {
        'package-1': {
          licenses: 'GPL-1.0',
          repository: 'https://git.com/repo/repo',
          path: '/path/to/package',
          licenseFile: '/path/to/package/LICENSE'
        }
      };

      checker.parsePackages.mockResolvedValueOnce(packages);

      await runner.run(checker, reporter, args);

      expect(reporter.writeReportFile).toHaveBeenCalled();
    });

    it('should call the reporter to generate the report file if the "generateOutputOn" argument is not supplied', async () => {
      const args = {
        start: '/path/to/cwd'
      };
      const packages = {
        'package-1': {
          licenses: 'GPL-1.0',
          repository: 'https://git.com/repo/repo',
          path: '/path/to/package',
          licenseFile: '/path/to/package/LICENSE'
        }
      };

      checker.parsePackages.mockResolvedValueOnce(packages);

      await runner.run(checker, reporter, args);

      expect(reporter.writeReportFile).toHaveBeenCalled();
    });

    it('should call the reporter with the right arguments', async () => {
      const args = {
        start: '/path/to/cwd',
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

      checker.parsePackages.mockResolvedValueOnce(packages);

      await runner.run(checker, reporter, args);

      expect(reporter.writeReportFile).toHaveBeenCalledWith(
        args.outputFileName,
        [{ licenses: packages['package-1'].licenses, package: Object.keys(packages)[0], repository: packages['package-1'].repository }],
        args.customHeader
      );
    });
  });
});

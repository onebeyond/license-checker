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

    it('should throw an error if the arguments contains one of the licenses affected by the spdx-satisfies module', async () => {
      const args = {
        checkLicense: 'GFDL-1.1-invariants-or-later'
      };

      let error;
      try {
        await runner.run(checker, reporter, args);
      } catch (e) {
        error = e;
      } finally {
        expect(error.message).toMatch('GFDL-1.x licenses are temporary unallowed. There\'s an issue pending to solve.');
      }
    });
  });

  describe('Check arguments', () => {
    it('should return an error if any of the licenses provided to the "failOn" argument are not SPDX compliant', async () => {
      const args = {
        failOn: ['MIT', 'GPL', 'BSD']
      };

      let error;
      try {
        await runner.run(checker, reporter, args);
      } catch (e) {
        error = e;
      } finally {
        expect(error.message).toBe('The following licenses are not SPDX compliant. Please, use the --checkLicense option to validate your input:\nGPL | BSD');
      }
    });

    it('should return an error if any of the licenses provided to the "generateOutputOn" argument are not SPDX compliant', async () => {
      const args = {
        generateOutputOn: ['MIT', 'GPL', 'BSD']
      };

      let error;
      try {
        await runner.run(checker, reporter, args);
      } catch (e) {
        error = e;
      } finally {
        expect(error.message).toBe('The following licenses are not SPDX compliant. Please, use the --checkLicense option to validate your input:\nGPL | BSD');
      }
    });

    it('should return an error if any of the licenses provided to the "failOn" argument are affected by the temporal issue', async () => {
      const args = {
        failOn: ['MIT', 'GPL', 'GFDL-1.1-invariants-or-later']
      };

      let error;
      try {
        await runner.run(checker, reporter, args);
      } catch (e) {
        error = e;
      } finally {
        expect(error.message).toBe("Your failOn list contains a GFDL-1.x licenses and they are temporary unallowed. There's an issue pending to solve.");
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

    it('should throw an error if any packages\' licenses satisfies the "failOn" argument', async () => {
      const args = {
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

      checker.parsePackages.mockResolvedValueOnce(packages);

      let error;
      try {
        await runner.run(checker, reporter, args);
      } catch (e) {
        error = e;
      } finally {
        expect(error.message).toBe('Found 1 packages with licenses defined by the --failOn flag:\n > 1 packages with license MIT');
      }
    });

    it('should not throw an error if one of the licences in a package joined by the operator OR contains one of the licences in the failOn arguments', async () => {
      const args = {
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

      checker.parsePackages.mockResolvedValueOnce(packages);
      try {
        await runner.run(checker, reporter, args);
      } catch (err) {
        error = err;
      } finally {
        expect(error).toBeUndefined();
      }
    });

    it('should not throw an error if one of the licences in a package joined by the operator AND does not contain any licences in the failOn arguments', async () => {
      const args = {
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

      checker.parsePackages.mockResolvedValueOnce(packages);

      let error;
      try {
        await runner.run(checker, reporter, args);
      } catch (err) {
        error = err;
      } finally {
        expect(error).toBeUndefined();
      }
    });

    it('should throw an error if any packages\' licenses joined by the AND operator satisfies the "failOn" argument', async () => {
      const args = {
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

      checker.parsePackages.mockResolvedValueOnce(packages);

      let error;
      try {
        await runner.run(checker, reporter, args);
      } catch (err) {
        error = err;
      } finally {
        expect(error.message).toBe('Found 1 packages with licenses defined by the --failOn flag:\n > 1 packages with license MIT AND Apache-2.0');
      }
    });
  });

  describe('Error report file', () => {
    it('should not call the reporter to generate the error file if none of the packages\' licenses satisfy the "failOn" argument', async () => {
      const args = {
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

      checker.parsePackages.mockResolvedValueOnce(packages);

      await runner.run(checker, reporter, args);

      expect(reporter.writeErrorReportFile).not.toHaveBeenCalled();
    });

    it('should call the reporter to generate the error report if any packages\' licenses satisfy the "failOn" argument', async () => {
      const args = {
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
        generateOutputOn: ['MIT', '0BSD']
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
        generateOutputOn: ['GPL-1.0', 'MIT']
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

const { check } = require('../src/runner.cjs');

describe('check command', () => {
  it('should throw an error if the license is not SPDX compliant', async () => {
    const license = 'GPL';

    let error;
    try {
      await check(license);
    } catch (e) {
      error = e;
    } finally {
      expect(error.message).toMatch(`Error: License "${license}" is not SPDX compliant`);
    }
  });

  it('should not throw an error if the license is SPDX compliant', async () => {
    const license = 'MIT';

    let error;
    try {
      await check(license);
    } catch (e) {
      error = e;
    } finally {
      expect(error).toBeUndefined();
    }
  });

  it('should throw an error if the alicense is one of the licenses not supported by the spdx-satisfies module', async () => {
    const license = 'GFDL-1.1-invariants-or-later';

    let error;
    try {
      await check(license);
    } catch (e) {
      error = e;
    } finally {
      expect(error.message).toMatch('GFDL-1.x licenses are temporary unallowed. There\'s an issue pending to be solved. 🙏');
    }
  });
});

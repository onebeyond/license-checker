const { checkArgs } = require('../src/utils');

describe('Utilities', () => {
  describe('checkArgs', () => {
    describe('when the command is "scan"', () => {
      it('should return true when the "_" property is not "scan"', () => {
        const args = { _: ['foo'] };

        let error;
        try {
          checkArgs(args);
        } catch (e) {
          error = e;
        } finally {
          expect(error).toBeUndefined();
        }
      });

      it('should throw an error if both "failOn" and "allowOnly" are missing when the "_" property is "scan"', () => {
        const args = { _: ['scan'], foo: 'bar' };

        let error;
        try {
          checkArgs(args);
        } catch (e) {
          error = e;
        } finally {
          expect(error.message).toBe('You need to provide the "failOn" or "allowOnly" option.');
        }
      });

      it('should throw an error if the "failOn" is an empty array when the "_" property is "scan"', () => {
        const args = { _: ['scan'], failOn: [] };

        let error;
        try {
          checkArgs(args);
        } catch (e) {
          error = e;
        } finally {
          expect(error.message).toBe('You need to provide at least one license.');
        }
      });

      it('should throw an error if the "allowOnly" is an empty array when the "_" property is "scan"', () => {
        const args = { _: ['scan'], allowOnly: [] };

        let error;
        try {
          checkArgs(args);
        } catch (e) {
          error = e;
        } finally {
          expect(error.message).toBe('You need to provide at least one license.');
        }
      });
    });
  });
});

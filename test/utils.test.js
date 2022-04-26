const { parseFailOnArgs, extractInvalidPackages } = require('../src/utils');

describe('parseFailOnArgs', () => {
  it('returns an array of strings when the arguments are strings', () => {
    const result = parseFailOnArgs(['MIT', 'GPL']);
    expect(result.invalid).toHaveLength(0);
    expect(result.valid).toEqual(['MIT', 'GPL']);
  });

  it('returns an array of RegExps when the arguments are enclosed in slashes', () => {
    const result = parseFailOnArgs(['/MIT/', '/GPL/']);
    expect(result.invalid).toHaveLength(0);
    expect(result.valid).toEqual([/MIT/, /GPL/]);
  });

  it('returns an array of strings and RegExps when the arguments are strings and strings enclosed in slashes', () => {
    const result = parseFailOnArgs(['/MIT/', 'GPL']);
    expect(result.invalid).toHaveLength(0);
    expect(result.valid).toEqual([/MIT/, 'GPL']);
  });

  it('parses the arguments enclosed in slashes even if the pattern includes a slash', () => {
    const result = parseFailOnArgs(['//MIT/']);
    expect(result.invalid).toHaveLength(0);
    expect(result.valid).toEqual([/\/MIT/]);
  });

  it('captures arguments that are invalid RegExps', () => {
    const result = parseFailOnArgs(['/gr[/']);
    expect(result.invalid).toEqual(['/gr[/']);
    expect(result.valid).toHaveLength(0);
  });

  it('parses the arguments as strings when they miss the trailing slash', () => {
    const result = parseFailOnArgs(['/MIT']);
    expect(result.invalid).toHaveLength(0);
    expect(result.valid).toEqual(['/MIT']);
  });

  it('parses the argument as string if it does not start with a slash', () => {
    const result = parseFailOnArgs(['e/MIT/']);
    expect(result.invalid).toHaveLength(0);
    expect(result.valid).toEqual(['e/MIT/']);
  });
});

describe('extractInvalidPackages', () => {
  it('returns an empty array if there is no packages with licenses matching the string', () => {
    const packages = [{
      package: '@org/test_package@1.0.0',
      licenses: 'MIT',
      repository: 'https://test-package.com',
      publisher: 'John Doe',
      email: 'johndoe@email.com'
    }];
    const result = extractInvalidPackages(['GPL'], packages);
    expect(result).toHaveLength(0);
  });

  it('returns an empty array if there is no packages with licenses matching the RegExp', () => {
    const packages = [{
      package: '@org/test_package@1.0.0',
      licenses: 'MIT',
      repository: 'https://test-package.com',
      publisher: 'John Doe',
      email: 'johndoe@email.com'
    }];
    const result = extractInvalidPackages([/GPL/], packages);
    expect(result).toHaveLength(0);
  });

  it('returns all the packages with licenses matching the strings', () => {
    const packages = [
      {
        package: '@org/test_package@1.0.0',
        licenses: 'MIT',
        repository: 'https://test-package.com',
        publisher: 'John Doe',
        email: 'johndoe@email.com'
      },
      {
        package: '@org/test_package2@1.0.0',
        licenses: 'GPL',
        repository: 'https://test2-package.com',
        publisher: 'John Doe',
        email: 'johndoe@email.com'
      },
      {
        package: '@org/test_package3@1.0.0',
        licenses: 'Apache-2.0',
        repository: 'https://test3-package.com',
        publisher: 'John Doe',
        email: 'johndoe@email.com'
      }
    ];
    const result = extractInvalidPackages(['GPL', 'Apache-2.0'], packages);
    expect(result).toEqual(packages.slice(1));
  });

  it('returns all the packages with licenses matching the RegExps', () => {
    const packages = [
      {
        package: '@org/test_package@1.0.0',
        licenses: 'MIT',
        repository: 'https://test-package.com',
        publisher: 'John Doe',
        email: 'johndoe@email.com'
      },
      {
        package: '@org/test_package2@1.0.0',
        licenses: 'AGPL',
        repository: 'https://test2-package.com',
        publisher: 'John Doe',
        email: 'johndoe@email.com'
      },
      {
        package: '@org/test_package3@1.0.0',
        licenses: 'Apache-2.0',
        repository: 'https://test3-package.com',
        publisher: 'John Doe',
        email: 'johndoe@email.com'
      }
    ];
    const result = extractInvalidPackages([/GPL/, /Apache/], packages);
    expect(result).toEqual(packages.slice(1));
  });
});

const trimLicenseArgs = args => ({
  ...args,
  failOn: args.failOn?.trim(),
  generateOutputOn: args.generateOutputOn?.trim()
});

module.exports = trimLicenseArgs;

const valid = require('spdx-expression-validate');

const isSpdxCompliant = license => {
  const isValid = valid(license);
  if (!isValid) throw new Error(`Error: License ${license} is not SPDX compliant`);
};

module.exports = {
  isSpdxCompliant
};

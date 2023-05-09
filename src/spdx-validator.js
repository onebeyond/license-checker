const valid = require('spdx-expression-validate');

const isSpdxCompliant = license => {
  const isValid = valid(license);
  if (!isValid) throw new Error(`Error: License ${license} is not SPDX compliant. Please visit https://spdx.org/licenses/ for the full list`);
};

module.exports = {
  isSpdxCompliant
};

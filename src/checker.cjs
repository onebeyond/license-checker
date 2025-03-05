const checker = require('license-checker');

const parsePackages = path => new Promise((resolve, reject) => {
  checker.init({
    start: path
  }, (error, packages) => {
    if (error) reject(new Error(`'license-checker error: ${error}`));
    else resolve(packages);
  });
});

module.exports = {
  parsePackages
};

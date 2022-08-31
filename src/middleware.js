const { parseFailOnArgs } = require('./utils');

const parseRegexLike = args => {
  const { valid: validArgs, invalid } = parseFailOnArgs(args.failOn || []);
  if (invalid.length) throw new Error(`The following args passed to --failOn are not valid: ${invalid.join(' ')}`);
  return { ...args, failOn: validArgs };
};

const parseGenerateOutputOn = args => {
  const { generateOutputOn } = args;
  const parsedOutputOn = generateOutputOn ? generateOutputOn.split(',').map(p => p.trim()) : [];
  return { ...args, generateOutputOn: parsedOutputOn };
};

const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

module.exports = args => pipe(
  parseRegexLike,
  parseGenerateOutputOn
)(args);

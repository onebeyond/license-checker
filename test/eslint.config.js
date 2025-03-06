import pluginsJest from 'eslint-plugin-jest';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    plugins: {
      jest: pluginsJest
    },
    languageOptions: {
      sourceType: "module",
      parserOptions: {
        ecmaVersion: 2020
      }
    },
    rules: {
      "jest/no-disabled-tests": "error",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/prefer-to-have-length": "warn",
      "jest/valid-expect": "error"
    }
  }
];
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
      "semi": ["error", "always"]
    }
  }
];
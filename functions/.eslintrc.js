module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "@eslint/js",
  ],
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-const": "error",
    "no-var": "error",
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
};

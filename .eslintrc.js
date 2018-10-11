module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:flowtype/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', 'flowtype', 'import'],
  rules: {
    indent: ['off'],
    'linebreak-style': ['off'],
    quotes: ['off'],
    semi: ['off'],
    'react/no-direct-mutation-state': ['off'],
  },
};

'use strict';

module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-flow'],
  plugins: [
    ['@babel/plugin-proposal-class-properties', { loose: false }],
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-import-meta',
  ],
};

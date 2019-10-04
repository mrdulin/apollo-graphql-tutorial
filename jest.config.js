const { defaults } = require('jest-config');
const pkg = require('./package.json');

module.exports = {
  automock: false,
  bail: 1,
  displayName: {
    name: pkg.name,
    color: 'blue',
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.setup.js'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  verbose: true,
};

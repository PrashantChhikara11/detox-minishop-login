module.exports = {
  preset: 'react-native',
  // e2e/ holds Detox tests, which run with their own config (e2e/jest.config.js)
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
};

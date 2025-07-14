module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.js',
    '**/*.(test|spec).js'
  ],
  collectCoverageFrom: [
    'modules/**/*.js',
    'field_shimmer_v4_modular.js',
    'semantic_detector.js',
    '!**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html'
  ],
  verbose: true,
  testTimeout: 30000, // 30 seconds for consciousness analysis
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
};
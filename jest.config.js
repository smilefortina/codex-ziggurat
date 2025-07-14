module.exports = {
    testEnvironment: 'node',
    testMatch: [
        '**/tests/**/*.test.js',
        '**/detection_lab/tests/**/*.test.js'
    ],
    collectCoverageFrom: [
        'server-secure.js',
        'detection_lab/field_shimmer_v4.js',
        'detection_lab/sensors/*.js',
        'scripts/*.js',
        '!node_modules/**',
        '!tests/**',
        '!coverage/**'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    testTimeout: 10000,
    verbose: true,
    forceExit: true,
    clearMocks: true,
    restoreMocks: true
};
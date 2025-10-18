module.exports = {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],
    testMatch: ['**/*.test.ts'],
    collectCoverageFrom: [
      'src/**/*.ts',
      '!src/**/*.d.ts',
      '!src/server.ts', // not including server.ts because it's covered by the health check
      '!src/seed.ts', // not including seed because it's manually run
    ],
  };
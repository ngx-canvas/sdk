/* eslint-disable */
export default {
  displayName: 'core',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      { tsconfig: '<rootDir>/tsconfig.spec.json', isolatedModules: true },
    ],
  },
  // d3 v3 subpackages ship ESM-only, so let ts-jest down-level every loaded
  // dependency to CommonJS for the jest runtime. (A narrow allowlist regex is
  // unreliable against pnpm's symlinked node_modules paths; the only deps these
  // tests actually load are d3-* and uuid, so transforming all is cheap.)
  transformIgnorePatterns: [],
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/projects/core',
};

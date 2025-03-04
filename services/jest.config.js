/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  transformIgnorePatterns: [
    "service_provider/node_modules/(?!@digitalbazzar)/",
  ],
  modulePathIgnorePatterns: [
    "__tests__/UNSWintegration.ts", // Note these files should run just need to ensure docker is open at run time
    "__tests__/integration.ts",
    "__tests__/verifier_presentation.ts",
    "__tests__/wallet_authorization.ts",
    "__tests__/issuer.ts"
  ]
};
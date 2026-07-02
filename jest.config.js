const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

const customJestConfig = {
  modulePathIgnorePatterns: ["<rootDir>/.next/"],
  testEnvironment: "node",
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  watchPathIgnorePatterns: ["<rootDir>/.next/"],
};

module.exports = createJestConfig(customJestConfig);

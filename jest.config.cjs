module.exports = {
    preset: 'ts-jest',             // Use ts-jest preset for TypeScript
    testEnvironment: 'node',       // Set test environment to Node.js
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',   // Transform TypeScript files using ts-jest
        '^.+\\.(js|jsx)$': 'babel-jest', // Transform JavaScript/JSX files using babel-jest
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'], // File extensions Jest should recognize
};


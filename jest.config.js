module.exports = {
    verbose: true,
    testEnvironment: 'jsdom',
    roots: ['<rootDir>/test'],
    rootDir: __dirname,
    testRegex: 'test/(.+)\\.test\\.(jsx?|tsx?)$',
    transform: {
        '\\.[jt]sx?$': 'babel-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'd.ts'],
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    moduleNameMapper: {
        'self-navigator': '<rootDir>/test/stubs/navigator.ts',
    },
};

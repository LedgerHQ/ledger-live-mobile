module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['.eslintrc.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'],
  },
  plugins: ['react', '@typescript-eslint', 'react-hooks'],
  // Fix error "Unable to resolve path to module" for tsx files
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  rules: {
    // Fix "React used before defined" error
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],

    // Allow jsx
    'react/jsx-filename-extension': ['warn', { extensions: ['.tsx'] }],

    // Fix error "Missing file extension tsx"
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never',
        tsx: 'never',
      },
    ],

    // Fix error "‘Enum’ is already declared in the upper scope"
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],

    // Add rules for react hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // Use 120 character windows
    'max-len': [
      'error',
      {
        code: 120,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],

    // Stop using default export
    'import/no-default-export': 'error',
    'import/prefer-default-export': 'off',

    // Since we use interfaces often in DDD and sometimes an implemented function uses this and sometimes not, it makes
    // this rule impractical.
    'class-methods-use-this': 'off',

    // Require accessibility modifiers on everything except public constructors
    '@typescript-eslint/explicit-member-accessibility': ['error', { overrides: { constructors: 'no-public' } }],

    // We use these many times in domain objects, so it makes sense to ignore them.
    '@typescript-eslint/no-empty-interface': 'off',

    // Allow test dependencies to appear in devDependencies
    'import/no-extraneous-dependencies': ['error', { devDependencies: ['**/*.test.ts', '**/*.test.tsx'] }],

    // Place default props inside class field
    'react/static-property-placement': ['error', 'static public field'],

    // Use only typescript-eslint package
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn', // or error
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
  },
};

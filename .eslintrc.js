module.exports = {
  root: true,
  extends: '@react-native',
  env: {
    jest: true,
  },
  plugins: ['unused-imports'],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      { 'vars': 'all', 'varsIgnorePattern': '^_', 'args': 'after-used', 'argsIgnorePattern': '^_' }
    ],
    'react-hooks/exhaustive-deps': 'off',
    'react-native/no-inline-styles': 'off',
    'no-catch-shadow': 'off',
    'react/no-unstable-nested-components': 'off'
  }
};

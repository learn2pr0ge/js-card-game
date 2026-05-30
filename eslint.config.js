import importX from 'eslint-plugin-import-x';
import jest from 'eslint-plugin-jest';

export default [
  {
    ignores: ['dist/', 'coverage/', 'docs/'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      'import-x': importX,
    },
    rules: {
      ...importX.flatConfigs.recommended.rules,
      'no-console': 'off',
    },
  },
  {
    files: ['test/**/*.js'],
    ...jest.configs['flat/recommended'],
  },
  {
    files: ['eslint.config.js'],
    rules: {
      'import-x/no-named-as-default': 'off',
      'import-x/no-named-as-default-member': 'off',
    },
  },
];

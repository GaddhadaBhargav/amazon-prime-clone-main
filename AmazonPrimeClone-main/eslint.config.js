import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'

export default [
  {ignores: ['build', 'dist', 'node_modules', '.vite']},
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {...globals.browser, ...globals.node},
      parserOptions: {
        ecmaFeatures: {jsx: true},
        sourceType: 'module',
      },
    },
    settings: {react: {version: 'detect'}},
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.flat.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-refresh/only-export-components': 'off',
      'react/no-unknown-property': [
        'error',
        {ignore: ['testid', 'data-testid']},
      ],
      'no-unused-vars': ['error', {varsIgnorePattern: '^[A-Z_]'}],
    },
  },
]

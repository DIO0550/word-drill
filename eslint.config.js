// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // アロー関数を優先
      'prefer-arrow-callback': 'error',
      'func-style': ['error', 'expression'],
      // interfaceではなくtypeを使用
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      // if/else/while等で必ず{}を使用
      'curly': ['error', 'all'],
      // 制御文の本体は次の行に配置（if文と同じ行にreturnを書かない）
      'nonblock-statement-body-position': ['error', 'below'],
    },
  },
])

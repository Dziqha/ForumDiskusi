// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import daStyle from 'eslint-config-dicodingacademy';

const eslintConfig = defineConfig([daStyle, ...nextVitals, ...nextTs, {
  rules: {
    quotes: ['error', 'single'],
    camelcase: ['error', { allow: ['Geist_Mono'] }],
  },
}, // Override default ignores of eslint-config-next.
globalIgnores([
  // Default ignores of eslint-config-next:
  '.next/**',
  'out/**',
  'build/**',
  'next-env.d.ts',
]), ...storybook.configs['flat/recommended']]);

export default eslintConfig;

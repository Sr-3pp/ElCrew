// @ts-check
import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import withNuxt from './.nuxt/eslint.config.mjs'

const tsParserPackage = readdirSync('./node_modules/.pnpm').find(name => name.startsWith('@typescript-eslint+parser@'))

if (!tsParserPackage) {
  throw new Error('Unable to locate @typescript-eslint/parser in node_modules/.pnpm')
}

const { default: tsParser } = await import(
  join(process.cwd(), 'node_modules/.pnpm', tsParserPackage, 'node_modules/@typescript-eslint/parser/dist/index.js')
)

export default withNuxt(
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tsParser,
      },
    },
    rules: {
      'no-unused-vars': 'off',
    },
  },
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      'no-unused-vars': 'off',
    },
  },
)

import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
  { ignores: ['dist', 'coverage', 'node_modules', 'prisma/migrations'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.node },
    },
    // The `lint` script runs with `--max-warnings 0`, so a `warn` below still
    // fails CI. `warn` means "amber in an editor, and a deliberate per-line
    // disable is an acceptable escape hatch", not "ignorable".
    rules: {
      // `argsIgnorePattern`: Express error middleware must keep its 4-arity
      // signature even when `next` is unused, or Express stops treating it as
      // an error handler. Such handlers rename the parameter to `_next`
      // rather than deleting it (see middleware/errorHandler.ts).
      // `ignoreRestSiblings` (the base rule's own default) allows the
      // `const { password, ...safe } = user` idiom used to strip a field.
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    // Vitest runs with `globals: true` (see vitest.config.ts), so the test
    // files reference describe/it/expect/vi without importing them.
    files: ['**/*.test.ts', 'src/test/**'],
    languageOptions: {
      globals: {
        ...globals.node,
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        vi: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
      },
    },
  },
]

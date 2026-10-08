import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default [
  { ignores: ['dist', 'coverage'] },

  // JS / JSX — shrinking set, removed entirely by the end of this plan
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: { react, 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },

  // TS / TSX — previously unlinted entirely
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ['**/*.{ts,tsx}'],
  })),
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: '18.3' } },
    plugins: { react, 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // prop-types are meaningless once props are typed
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },

  // Config files run in Node, not the browser
  {
    files: ['*.config.{js,ts}', 'vitest.config.ts', 'tailwind.config.js', 'postcss.config.js'],
    languageOptions: { globals: { ...globals.node } },
    rules: { 'no-undef': 'off' },
  },

  // Tests get Vitest globals
  {
    files: ['**/*.test.{ts,tsx}', 'src/test/**'],
    languageOptions: { globals: { ...globals.node } },
  },

  // Layer 3 never writes a colour. docs/PLAN.md §6.
  {
    files: ['src/**/*.{ts,tsx}'],
    // src/features/marketing is exempt until P1. Those 11 components carry 45
    // raw hex literals and the legacy gold* palette; restyling a landing page
    // is design work, not mechanical migration, and P0a's remit is "nothing new
    // ships, existing things become correct". Remove this exemption as part of
    // the P1 marketing redesign - see docs/PLAN.md section 4.
    ignores: ['src/design/**', 'src/features/marketing/**'],
    rules: {
      // esquery regex literals end at the first "/", so a slash inside one
      // (white/10, ink/70) is written as \x2f.
      'no-restricted-syntax': [
        'error',
        {
          selector: "Literal[value=/#[0-9a-fA-F]{3,8}\\b/]",
          message:
            'Raw colour literal. Use a design token (bg-ground, text-ink, text-go, …). See docs/PLAN.md §5.',
        },
        {
          // A Literal selector does not see template literals: the class string
          // in className={`bg-[#fff] ${x}`} is a TemplateElement, so the rule
          // above would miss it entirely. This codebase uses template literals
          // for conditional classNames, so that hole is reachable.
          selector: "TemplateElement[value.raw=/#[0-9a-fA-F]{3,8}\\b/]",
          message:
            'Raw colour literal in a template literal. Use a design token. See docs/PLAN.md §5.',
        },
        {
          selector: "Literal[value=/\\b(bg|text|border)-white\\x2f[0-9]+/]",
          message:
            'Translucent white overlay is banned. Use bg-surface-sunk or border-rule-soft. See docs/PLAN.md §5.',
        },
        {
          selector: "Literal[value=/\\brounded-(2xl|3xl|full)\\b/]",
          message: 'Radius above 3px is banned — chalk lines are straight. See docs/PLAN.md §5.',
        },
        {
          selector:
            "Literal[value=/\\b(bg|text|border|ring|from|to|via)-(ground|surface|surface-sunk|ink|ink-soft|ink-faint|go|urgent|pending|rule|rule-soft|scrim)\\x2f[0-9]/]",
          message:
            'Opacity modifier on a design token emits NO CSS. The tokens are var() colours and Tailwind 3 cannot apply /N to them, so the utility silently does not exist. Use a dedicated token such as bg-scrim. This cost us an invisible modal scrim once already.',
        },
        {
          selector: "Literal[value=/\\b(bg|text|border|ring|from|to|via)-(black|white|gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)(-[0-9]{2,3})?\\b/]",
          message:
            'Named Tailwind palette colour. Use a design token (bg-ground, text-ink, text-urgent, …). See docs/PLAN.md §5.',
        },
        {
          // The twin of the rule above. A conditional className is the most
          // likely way a named palette colour comes back, so the palette rule
          // needs this as much as the hex and rgb() rules do.
          selector:
            "TemplateElement[value.raw=/\\b(bg|text|border|ring|from|to|via)-(black|white|gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)(-[0-9]{2,3})?\\b/]",
          message:
            'Named Tailwind palette colour in a template literal. Use a design token. See docs/PLAN.md §5.',
        },
        {
          selector: "Literal[value=/\\b(rgb|rgba|hsl|hsla)\\(/]",
          message: 'Functional colour literal. Use a design token. See docs/PLAN.md §5.',
        },
        {
          selector: "TemplateElement[value.raw=/\\b(rgb|rgba|hsl|hsla)\\(/]",
          message: 'Functional colour literal in a template literal. Use a design token. See docs/PLAN.md §5.',
        },
      ],
    },
  },
]

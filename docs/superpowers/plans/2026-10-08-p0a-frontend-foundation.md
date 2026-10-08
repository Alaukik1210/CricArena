# P0a Frontend Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the CricArena frontend correct and coherent — one working type system, one token system, one visual identity, full TypeScript, zero lint errors, and a test + CI floor — without shipping any new product features.

**Architecture:** A three-layer frontend. Layer 1 is a single CSS custom-property token source consumed by Tailwind. Layer 2 is primitives that reference only tokens. Layer 3 is feature screens composed only from primitives, forbidden by lint from writing raw colours. Components move from a flat `components/` directory into feature modules, converting `.jsx → .tsx` in the same move so each file is touched once.

**Tech Stack:** React 18, TypeScript (strict), Vite 5, Tailwind CSS 3, Radix UI, TanStack Query v5, Redux Toolkit, Vitest, React Testing Library, Supertest, GitHub Actions. Server: Express 4, Prisma 6, PostgreSQL.

## Global Constraints

- **Branch:** `refactor/platform-foundation`. Commit after every task.
- **Repo root:** `e:\MERN\CricArena`. Client is `Client/`, server is `Server/`.
- **Palette — these exact hex values, no substitutions:** `--ground #D9C9A8`, `--surface #FAF7F0`, `--surface-sunk #CFBE9B`, `--ink #2B2520`, `--ink-soft #6E665C`, `--ink-faint #A79D90`, `--go #3F6B47`, `--urgent #A32A1F`, `--pending #B07B2A`.
- **`--radius` is `3px`.** No Tailwind radius utility above `rounded-[3px]` may be introduced.
- **Banned visual patterns:** no gradients, no `box-shadow` glows, no `rounded-2xl`/`rounded-3xl`/`rounded-full` on panels, no translucent white overlays (`bg-white/5`, `border-white/10`). Elevation = 1px `--rule` + the tonal step from `--ground` to `--surface`.
- **Typefaces:** Anton (display, H1–H2 only), Inter Tight (body), IBM Plex Mono (all numerals, with `font-variant-numeric: tabular-nums`).
- **Layer 3 never writes a colour.** No hex literals and no `bg-white/N`-style utilities outside `src/design/`. Enforced by lint in Task 15.
- **Every task ends green:** `npx tsc --noEmit` exit 0 in the package you touched, and `npx vitest run` passing once Task 1 lands.
- **Out of scope (P0b, later spec):** `ORGANIZER` role, discovery SQL rewrite, tournament date/money normalisation, `Team.members`/`Team.players` collapse, Stripe webhook signature verification, Socket.IO.

---

### Task 1: Test and CI infrastructure

Nothing else in this plan can be test-driven until a runner exists. This task also adds TypeScript linting — `eslint.config.js` currently matches only `**/*.{js,jsx}`, so the TS files added in later tasks would otherwise be completely unlinted.

**Files:**
- Create: `.gitattributes`
- Create: `Client/vitest.config.ts`
- Create: `Client/src/test/setup.ts`
- Create: `Client/src/test/smoke.test.ts`
- Create: `Server/vitest.config.ts`
- Create: `Server/src/test/smoke.test.ts`
- Create: `.github/workflows/ci.yml`
- Modify: `Client/package.json` (scripts, devDependencies)
- Modify: `Server/package.json` (scripts, devDependencies)
- Modify: `Client/eslint.config.js`

**Interfaces:**
- Consumes: nothing.
- Produces: `npm test` and `npm run test:run` in both packages; `describe`/`it`/`expect` globals in tests; `@testing-library/jest-dom` matchers available in client tests; a `ci` workflow gating `typecheck → lint → test → build`.

- [ ] **Step 1: Add `.gitattributes` to stop CRLF churn**

The last commit emitted ~95 `LF will be replaced by CRLF` warnings. Left alone, this produces phantom whole-file diffs.

Create `.gitattributes` at the repo root:

```
* text=auto eol=lf

*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.svg text eol=lf
*.woff binary
*.woff2 binary
*.ttf binary
*.ico binary
```

- [ ] **Step 2: Install client test dependencies**

```bash
cd Client
npm i -D vitest@^2 jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @vitest/coverage-v8
```

- [ ] **Step 3: Install TypeScript ESLint so `.ts`/`.tsx` are actually linted**

```bash
cd Client
npm i -D typescript-eslint
```

- [ ] **Step 4: Create `Client/vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: { "@": path.resolve(__dirname, "./src") },
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: ["./src/test/setup.ts"],
        css: true,
    },
});
```

- [ ] **Step 5: Create `Client/src/test/setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
    cleanup();
});
```

- [ ] **Step 6: Write the client smoke test**

Create `Client/src/test/smoke.test.ts`:

```ts
import { describe, it, expect } from "vitest";

describe("test infrastructure", () => {
    it("runs and has jest-dom matchers registered", () => {
        const el = document.createElement("div");
        el.textContent = "ok";
        document.body.appendChild(el);
        expect(el).toBeInTheDocument();
        expect(el).toHaveTextContent("ok");
    });
});
```

- [ ] **Step 7: Add client scripts**

In `Client/package.json`, replace the `"scripts"` block with:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc --noEmit && vite build",
  "typecheck": "tsc --noEmit",
  "lint": "eslint .",
  "test": "vitest",
  "test:run": "vitest run",
  "preview": "vite preview"
}
```

- [ ] **Step 8: Run the client smoke test — expect PASS**

```bash
cd Client && npx vitest run src/test/smoke.test.ts
```

Expected: `1 passed`. If it fails with "Cannot find module '@testing-library/jest-dom/vitest'", the installed version predates that entry point — use `import "@testing-library/jest-dom"` instead.

- [ ] **Step 9: Install server test dependencies**

```bash
cd Server
npm i -D vitest@^2 supertest @types/supertest
```

- [ ] **Step 10: Create `Server/vitest.config.ts`**

The server is `"type": "commonjs"`, so no `environment` override is needed.

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        globals: true,
        environment: "node",
        include: ["src/**/*.test.ts"],
    },
});
```

- [ ] **Step 11: Write the server smoke test**

Create `Server/src/test/smoke.test.ts`:

```ts
import { describe, it, expect } from "vitest";

describe("server test infrastructure", () => {
    it("runs", () => {
        expect(1 + 1).toBe(2);
    });
});
```

- [ ] **Step 12: Add server scripts**

In `Server/package.json`, replace `"test": "echo \"Error: no test specified\" && exit 1"` with:

```json
"test": "vitest",
"test:run": "vitest run",
```

Keep `dev`, `start`, `typecheck`, and `prisma:generate` as they are.

- [ ] **Step 13: Run the server smoke test — expect PASS**

```bash
cd Server && npx vitest run
```

Expected: `1 passed`.

- [ ] **Step 14: Extend ESLint to TypeScript**

Replace `Client/eslint.config.js` with:

```js
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
]
```

- [ ] **Step 15: Confirm lint now covers TS and record the baseline**

```bash
cd Client && npx eslint . 2>&1 | tail -3
```

Expected: still errors (that's fine — Task 15 drives them to zero), but the count should now **include** `.ts`/`.tsx` files. Note the number; it is the baseline Task 15 must reduce to 0.

- [ ] **Step 16: Create the CI workflow**

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  client:
    name: Client
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: Client
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: Client/package-lock.json
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run test:run
      - run: npx vite build

  server:
    name: Server
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: Server
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: Server/package-lock.json
      - run: npm ci
      - run: npx prisma generate
      - run: npm run typecheck
      - run: npm run test:run
```

> `npm run lint` will fail CI until Task 15. That is intentional — it makes the remaining lint debt visible rather than silent. If you want green CI before then, temporarily append `|| true` to the lint line and remove it in Task 15.

- [ ] **Step 17: Commit**

```bash
git add .gitattributes .github Client/vitest.config.ts Client/src/test Client/package.json Client/package-lock.json Client/eslint.config.js Server/vitest.config.ts Server/src/test Server/package.json Server/package-lock.json
git commit -m "chore: add Vitest, RTL, Supertest, TS linting, and CI

- Vitest + jsdom + Testing Library for the client, Vitest + Supertest for the server
- Extend ESLint to .ts/.tsx, which were previously unlinted entirely
- Add .gitattributes (eol=lf) to stop CRLF churn
- CI: typecheck, lint, test, build on both packages"
```

---

### Task 2: Real font system

Gap #1: nine `@font-face` rules point at `../fonts/`, a directory that does not exist, so the entire type scale silently falls back to system sans. Using `@fontsource` npm packages makes this class of bug impossible — Vite resolves the import at build time, so a missing font is a **build error**, not a silent fallback.

**Files:**
- Create: `Client/src/design/fonts.css`
- Modify: `Client/src/index.css:1-120` (remove the `@import` lines and all nine `@font-face` blocks)
- Modify: `Client/index.html:7-11` (remove the inline `<style>` `@import`)
- Modify: `Client/package.json`

**Interfaces:**
- Consumes: nothing.
- Produces: CSS variables `--font-display`, `--font-body`, `--font-data`, importable via `@import "./design/fonts.css"`.

- [ ] **Step 1: Install the typefaces**

```bash
cd Client
npm i @fontsource/anton @fontsource-variable/inter-tight @fontsource/ibm-plex-mono
```

If `@fontsource-variable/inter-tight` 404s, fall back to `npm i @fontsource/inter-tight` and import `400.css`/`600.css` instead of the variable file in Step 2.

- [ ] **Step 2: Create `Client/src/design/fonts.css`**

```css
/* Self-hosted via @fontsource. Vite resolves these at build time —
   a missing package is a build error, never a silent system-sans fallback.
   This is the fix for the `../fonts/` bug (docs/PLAN.md §3, gap #1). */

@import "@fontsource/anton/400.css";
@import "@fontsource-variable/inter-tight/index.css";
@import "@fontsource/ibm-plex-mono/400.css";
@import "@fontsource/ibm-plex-mono/500.css";
@import "@fontsource/ibm-plex-mono/600.css";

:root {
    --font-display: "Anton", "Arial Narrow", sans-serif;
    --font-body: "Inter Tight Variable", "Inter Tight", system-ui, sans-serif;
    --font-data: "IBM Plex Mono", ui-monospace, monospace;
}
```

- [ ] **Step 3: Strip the dead font declarations from `index.css`**

Delete **all** of the following from `Client/src/index.css`:
- The four `@import url('https://fonts.googleapis.com/...')` lines at the top (three of which 404 — Product Sans is not on Google Fonts)
- The entire Cabinet Grotesk licence comment block
- All nine `@font-face` blocks (`CabinetGrotesk-Thin` through `CabinetGrotesk-Variable`)

Replace the top of the file with:

```css
@import "./design/fonts.css";

@tailwind base;
@tailwind components;
@tailwind utilities;
```

Leave the rest of the file alone for now — Task 3 replaces the token blocks.

- [ ] **Step 4: Remove the duplicate import from `index.html`**

In `Client/index.html`, delete the `<style>` element containing the Audiowide `@import`. The `<head>` becomes:

```html
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="./src/assets/logo.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CricArena</title>
  </head>
```

- [ ] **Step 5: Verify the fonts actually load**

```bash
cd Client && npx vite build 2>&1 | grep -iE "font|woff" | head -20
```

Expected: `.woff2` files emitted into `dist/assets/`. If nothing is emitted, the `@import`s did not resolve — stop and fix before continuing, because this is precisely the failure mode being eliminated.

- [ ] **Step 6: Confirm no dead references remain**

```bash
cd Client && grep -rn "CabinetGrotesk\|Product Sans\|fonts.googleapis" src/ index.html
```

Expected: **no output.** (`tailwind.config.js` still references `cabinet-*`; Task 3 removes those.)

- [ ] **Step 7: Commit**

```bash
git add Client/src/design/fonts.css Client/src/index.css Client/index.html Client/package.json Client/package-lock.json
git commit -m "fix(client): replace dead font system with self-hosted @fontsource

Nine @font-face rules pointed at ../fonts/, a directory that does not
exist, so the entire type scale fell back to system sans. Three of four
Google Fonts imports also 404'd (Product Sans is not hosted there).

Vite now resolves fonts at build time, so a missing font fails the build
instead of degrading silently."
```

---

### Task 3: Maidan token layer and Tailwind wiring

**Files:**
- Create: `Client/src/design/tokens.css`
- Modify: `Client/src/index.css` (delete both old token systems and every hand-rolled `.product-*` / `.cta-*` class)
- Modify: `Client/tailwind.config.js`

**Interfaces:**
- Consumes: `--font-*` from Task 2.
- Produces: Tailwind utilities `bg-ground`, `bg-surface`, `bg-surface-sunk`, `text-ink`, `text-ink-soft`, `text-ink-faint`, `text-go`, `text-urgent`, `text-pending` (and `bg-`/`border-` variants), `border-rule`, `border-rule-soft`, `font-display`, `font-body`, `font-data`, `rounded` → 3px.

- [ ] **Step 1: Create `Client/src/design/tokens.css`**

```css
/* The single source of colour for the application.
   Nothing outside src/design/ may write a colour literal — enforced by
   lint in Task 15. See docs/PLAN.md §5. */

:root {
    /* surfaces */
    --ground: #D9C9A8;
    --surface: #FAF7F0;
    --surface-sunk: #CFBE9B;

    /* ink */
    --ink: #2B2520;
    --ink-soft: #6E665C;
    --ink-faint: #A79D90;

    /* semantic — each maps to a cricket meaning, not a mood */
    --go: #3F6B47;
    --urgent: #A32A1F;
    --pending: #B07B2A;

    /* line */
    --rule: #2B2520;
    --rule-soft: rgba(43, 37, 32, 0.16);

    --radius: 3px;
}

html {
    background: var(--ground);
}

body {
    background: var(--ground);
    color: var(--ink);
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
}

/* All numerals are tabular, everywhere. */
.font-data,
[class*="font-data"] {
    font-variant-numeric: tabular-nums;
}
```

- [ ] **Step 2: Rewrite `Client/src/index.css`**

Replace the file with the following. Note this is **additive**: the Maidan tokens arrive, but the legacy shadcn `:root` block and the `.product-*` classes are **kept, marked deprecated**, because 24 files still consume them and are not migrated until Tasks 9-13. Deleting them here would leave the app unstyled for ten commits. Task 15 removes the legacy block once a grep proves no consumer remains.

```css
@import "./design/fonts.css";
@import "./design/tokens.css";

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
    /* Accessibility floor — expanded in Task 14. */
    :focus-visible {
        outline: 2px solid var(--ink);
        outline-offset: 2px;
    }

    @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
        }
    }
}

/* ===================================================================
   DEPRECATED — legacy token system and utility classes.
   24 files still consume these; they migrate in Tasks 4 and 9-13.
   Task 15 deletes this whole block once grep proves zero consumers.
   Do NOT add new usages. See docs/PLAN.md §5.
   =================================================================== */
```

Below that marker, **keep verbatim** everything already in the file from the `@layer base { :root { --background: ... } }` shadcn block through the final `.surface-divider` rule. Change nothing inside it — it is scaffolding with a scheduled demolition date, not code to improve.

Why keep it: `avatar.jsx`, `popover.jsx`, `select.jsx`, `tabs.jsx`, and `toast.jsx` reference the shadcn HSL utilities (`bg-popover`, `text-card-foreground`, …) and stay `.jsx` until Task 13; 24 files reference the `.product-*` / `cta-*` classes. Deleting either set now breaks the running app for ten commits with no compensating benefit.

- [ ] **Step 3: Rewrite `Client/tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                ground: "var(--ground)",
                surface: {
                    DEFAULT: "var(--surface)",
                    sunk: "var(--surface-sunk)",
                },
                ink: {
                    DEFAULT: "var(--ink)",
                    soft: "var(--ink-soft)",
                    faint: "var(--ink-faint)",
                },
                go: "var(--go)",
                urgent: "var(--urgent)",
                pending: "var(--pending)",
                rule: {
                    DEFAULT: "var(--rule)",
                    soft: "var(--rule-soft)",
                },
            },
            fontFamily: {
                display: ["var(--font-display)"],
                body: ["var(--font-body)"],
                data: ["var(--font-data)"],
                // DEPRECATED — the legacy .display-title / .section-title rules
                // @apply these. Tailwind errors with "class does not exist" if
                // they are removed while those rules remain. Task 15 drops both
                // together with the legacy block.
                "cabinet-black": ["var(--font-display)"],
                "cabinet-extrabold": ["var(--font-display)"],
            },
            borderRadius: {
                DEFAULT: "var(--radius)",
                sm: "2px",
                md: "var(--radius)",
                lg: "var(--radius)",
            },
            // Only the nine actually referenced in src/. Verified with:
            //   grep -rhoE "bg-(hero-pattern|matches[0-9]*|ball|banner[0-9]*|bann)" src/ | sort -u
            backgroundImage: {
                "hero-pattern": 'url("/src/assets/herobg.png")',
                matches: 'url("/src/assets/matchbg1.png")',
                matches1: 'url("/src/assets/matchbg2.jpg")',
                matches2: 'url("/src/assets/matchbg3.jpg")',
                matches3: 'url("/src/assets/matchbg4.jpg")',
                ball: 'url("/src/assets/ballbg1.png")',
                banner: 'url("/src/assets/banner1.png")',
                banner3: 'url("/src/assets/banner3.png")',
                bann: 'url("/src/assets/bann.png")',
            },
            screens: { xs: "475px" },
        },
    },
    // DEPRECATED — ui/popover, ui/select, ui/tabs and ui/toast use this
    // plugin's animate-in / fade-* / zoom-* / slide-in-* utilities and remain
    // .jsx until Task 13. Removing it here silently drops those utilities
    // (Tailwind emits no error for an unknown class) and kills their
    // enter/exit transitions. Revisit in Task 15.
    plugins: [require("tailwindcss-animate")],
};
```

Removed: `darkMode` (there is no dark theme), the `goldy`/`gold`/`goldx`/`orangex` literals, all eight `cabinet-*` families and the three Product Sans families, the three genuinely unused `backgroundImage` entries (`matches4`, `matches5`, `banner2`), the unused `animate` keyframe, and `tailwindcss-animate` (nothing referenced it).

**Kept deliberately:** the shadcn HSL colour mappings (`background`, `card`, `popover`, `primary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`). Five `ui/*.jsx` primitives still use them and are not converted until Task 13; removing the mappings now would break them. Task 15 deletes the mappings together with the `:root` block that backs them.

- [ ] **Step 3b: Delete the one stray `--radius` from the legacy block**

The legacy `:root` block declares `--radius: 0.5rem` *after* `design/tokens.css` sets `--radius: 3px`. Equal specificity means the later declaration wins, so every `rounded` / `rounded-md` / `rounded-lg` utility resolves to 8px and the design system silently fails to apply its own radius for the rest of the migration.

This is the **one** sanctioned edit inside the deprecated block. Delete exactly this line from the legacy `@layer base { :root { ... } }`:

```css
        --radius: 0.5rem;
```

Leave every other line in that block untouched. Nothing in the legacy CSS depends on an 8px radius — the `.product-*` rules use literal `rounded-[28px]` / `rounded-3xl` values — so the only effect is that `rounded` now correctly means 3px, which is the target.

Verify:

```bash
cd Client && grep -c -- "--radius" src/index.css
```

Expected: `1` (only the Maidan declaration in `design/tokens.css` remains authoritative; this grep covers `index.css` alone, which should now have zero — if it prints `0`, that is correct and the `1` is in tokens.css).

- [ ] **Step 4: Build and expect failures — this is the inventory**

```bash
cd Client && npx vite build 2>&1 | tail -30
```

The build will likely succeed (Tailwind silently drops unknown utilities), but screens referencing deleted classes will render unstyled. Capture the full inventory:

```bash
cd Client && grep -rnoE "product-(page|shell|panel|hero|card|grid[0-9-]*)|section-(kicker|title|copy)|display-title|stat-(card|value)|muted-copy|pill-(accent|gold)|standard-(input|select|textarea)|cta-(primary|secondary)|surface-divider|font-cabinet[a-z-]*|text-\[#[0-9a-fA-F]+\]|bg-white/[0-9]+|border-white/[0-9]+" src/ | tee /tmp/p0a-class-inventory.txt | wc -l
```

Keep `/tmp/p0a-class-inventory.txt`. Tasks 9–13 work through it; Task 15 asserts it is empty.

- [ ] **Step 5: Verify the token utilities resolve**

Create a throwaway probe `Client/src/design/__probe.tsx`:

```tsx
export const Probe = () => (
    <div className="bg-ground text-ink border-rule font-display rounded">
        <span className="bg-surface text-ink-soft font-data">1.234</span>
        <span className="text-go">go</span>
        <span className="text-urgent">urgent</span>
        <span className="text-pending">pending</span>
    </div>
);
```

```bash
cd Client && npx vite build && grep -c "D9C9A8\|2B2520" dist/assets/*.css
```

Expected: a non-zero count, proving the token values reached the stylesheet. Then delete the probe:

```bash
rm Client/src/design/__probe.tsx
```

- [ ] **Step 6: Commit**

```bash
git add Client/src/design/tokens.css Client/src/index.css Client/tailwind.config.js
git commit -m "feat(design): single Maidan token layer

Replaces two competing token systems — shadcn HSL vars in :root/.dark
(never activated; .dark was applied nowhere) and hand-rolled --arena-*
hex vars — with one source consumed by Tailwind.

Also drops the eight dead cabinet-* font families, three Product Sans
families, eleven unused background images, and tailwindcss-animate."
```

---

### Task 4: Rewire `ui/*` primitives to tokens

The shadcn primitives reference `bg-primary`, `text-card-foreground`, etc., which Task 3 deleted. They must be rewired, converted to TypeScript, and stripped of the prop-types errors that make up the bulk of the lint baseline.

**Files:**
- Create: `Client/src/components/ui/button.tsx`, `card.tsx`, `input.tsx`, `label.tsx`, `badge.tsx`, `textarea.tsx`
- Delete: the `.jsx` counterparts of each
- Test: `Client/src/components/ui/button.test.tsx`

**Interfaces:**
- Consumes: Tailwind token utilities from Task 3.
- Produces: `Button` (`variant`: `default | outline | ghost | urgent`, `size`: `default | sm | lg | icon`), `Card`/`CardHeader`/`CardTitle`/`CardContent`, `Input`, `Label`, `Badge` (`tone`: `neutral | go | urgent | pending`), `Textarea`. All forward refs and accept `className`.

- [ ] **Step 1: Write the failing test**

Create `Client/src/components/ui/button.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./button";

describe("Button", () => {
    it("renders its children", () => {
        render(<Button>Join room</Button>);
        expect(screen.getByRole("button", { name: "Join room" })).toBeInTheDocument();
    });

    it("applies the urgent variant", () => {
        render(<Button variant="urgent">Closing</Button>);
        expect(screen.getByRole("button")).toHaveClass("bg-urgent");
    });

    it("merges a caller className", () => {
        render(<Button className="w-full">Wide</Button>);
        expect(screen.getByRole("button")).toHaveClass("w-full");
    });

    it("uses no banned radius utility", () => {
        render(<Button>Flat</Button>);
        const cls = screen.getByRole("button").className;
        expect(cls).not.toMatch(/rounded-(2xl|3xl|full)/);
    });
});
```

- [ ] **Step 2: Run it — expect FAIL**

```bash
cd Client && npx vitest run src/components/ui/button.test.tsx
```

Expected: FAIL — `button.tsx` does not exist yet (resolves to `button.jsx`, whose `bg-primary` class no longer exists, so the urgent-variant assertion fails).

- [ ] **Step 3: Write `Client/src/components/ui/button.tsx`**

```tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default: "bg-ink text-surface hover:bg-ink-soft",
                outline: "border border-rule bg-surface text-ink hover:bg-surface-sunk",
                ghost: "text-ink hover:bg-surface-sunk",
                urgent: "bg-urgent text-surface hover:opacity-90",
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-8 px-3 text-xs",
                lg: "h-11 px-8",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: { variant: "default", size: "default" },
    },
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
        );
    },
);
Button.displayName = "Button";

// `buttonVariants` is intentionally NOT exported. Nothing consumes it, and
// exporting a non-constant alongside a component trips
// react-refresh/only-export-components, which Task 15 must drive to zero
// warnings. Re-export it only when a caller actually needs it.
export { Button };
```

- [ ] **Step 4: Delete the old button and run the test — expect PASS**

```bash
cd Client && rm src/components/ui/button.jsx && npx vitest run src/components/ui/button.test.tsx
```

Expected: `4 passed`.

- [ ] **Step 5: Convert `card.tsx`**

Create `Client/src/components/ui/card.tsx`, then `rm src/components/ui/card.jsx`:

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("rounded border border-rule bg-surface text-ink", className)} {...props} />
    ),
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("flex flex-col gap-1.5 p-5", className)} {...props} />
    ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h3 ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
    ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p ref={ref} className={cn("text-sm text-ink-soft", className)} {...props} />
    ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => <div ref={ref} className={cn("p-5 pt-0", className)} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("flex items-center p-5 pt-0", className)} {...props} />
    ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
```

- [ ] **Step 6: Convert `input.tsx`, `label.tsx`, `textarea.tsx`**

Create each, then delete its `.jsx` counterpart.

`input.tsx`:

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ className, type, ...props }, ref) => (
        <input
            type={type}
            ref={ref}
            className={cn(
                "flex h-10 w-full rounded border border-rule bg-surface px-3 py-2 text-sm text-ink",
                "placeholder:text-ink-faint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
                "disabled:cursor-not-allowed disabled:opacity-50",
                className,
            )}
            {...props}
        />
    ),
);
Input.displayName = "Input";

export { Input };
```

`label.tsx`:

```tsx
import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

const Label = React.forwardRef<
    React.ElementRef<typeof LabelPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
    <LabelPrimitive.Root
        ref={ref}
        className={cn("text-sm font-medium text-ink peer-disabled:opacity-70", className)}
        {...props}
    />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
```

`textarea.tsx`:

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
    ({ className, ...props }, ref) => (
        <textarea
            ref={ref}
            className={cn(
                "flex min-h-28 w-full resize-y rounded border border-rule bg-surface px-3 py-2 text-sm text-ink",
                "placeholder:text-ink-faint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
                "disabled:cursor-not-allowed disabled:opacity-50",
                className,
            )}
            {...props}
        />
    ),
);
Textarea.displayName = "Textarea";

export { Textarea };
```

- [ ] **Step 7: Create `badge.tsx` with semantic tones**

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium",
    {
        variants: {
            tone: {
                neutral: "border-rule-soft bg-surface-sunk text-ink-soft",
                go: "border-go bg-surface text-go",
                urgent: "border-urgent bg-surface text-urgent",
                pending: "border-pending bg-surface text-pending",
            },
        },
        defaultVariants: { tone: "neutral" },
    },
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLSpanElement>,
        VariantProps<typeof badgeVariants> {}

const Badge = ({ className, tone, ...props }: BadgeProps) => (
    <span className={cn(badgeVariants({ tone }), className)} {...props} />
);

// `badgeVariants` is intentionally not exported — same reason as buttonVariants.
export { Badge };
```

Then `rm src/components/ui/badge.jsx`.

- [ ] **Step 8: Typecheck, test, and lint the primitives**

```bash
cd Client && npx tsc --noEmit && npx vitest run src/components/ui && npx eslint src/components/ui
```

Expected: typecheck exit 0, tests pass, **zero** lint errors in `src/components/ui`.

> `avatar.jsx`, `popover.jsx`, `select.jsx`, `tabs.jsx`, `toast.jsx`, `toaster.jsx` are left as `.jsx` here and converted in Task 13, where their consumers move. They still carry prop-types errors until then.

- [ ] **Step 9: Commit**

```bash
git add Client/src/components/ui
git commit -m "feat(ui): rewire core primitives to Maidan tokens, convert to TS

Button, Card, Input, Label, Textarea, Badge now reference only tokens
and are fully typed, removing the prop-types lint errors that made up
most of the baseline. Badge gains semantic go/urgent/pending tones."
```

---

### Task 5: `CreaseCard` — the signature component

Squad completion is encoded as how much of the card's border is drawn, from `currentPlayers / requiredPlayers`.

**Files:**
- Create: `Client/src/components/ui/crease-card.tsx`
- Test: `Client/src/components/ui/crease-card.test.tsx`

**Interfaces:**
- Consumes: tokens (Task 3), `cn` from `@/lib/utils`.
- Produces: `creaseFill(current: number, required: number): number` returning a 0–1 clamped ratio, and `<CreaseCard current required title meta children className />`.

- [ ] **Step 1: Write the failing test**

Create `Client/src/components/ui/crease-card.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CreaseCard, creaseFill } from "./crease-card";

describe("creaseFill", () => {
    it("returns the plain ratio", () => {
        expect(creaseFill(7, 11)).toBeCloseTo(0.6364, 3);
    });

    it("returns 1 when the squad is full", () => {
        expect(creaseFill(11, 11)).toBe(1);
    });

    it("clamps above full", () => {
        expect(creaseFill(14, 11)).toBe(1);
    });

    it("returns 0 for an empty squad", () => {
        expect(creaseFill(0, 11)).toBe(0);
    });

    it("returns 0 rather than NaN when required is 0", () => {
        expect(creaseFill(3, 0)).toBe(0);
    });

    it("treats negative current as 0", () => {
        expect(creaseFill(-2, 11)).toBe(0);
    });

    it("returns 0 for non-finite inputs", () => {
        expect(creaseFill(NaN, 11)).toBe(0);
        expect(creaseFill(5, Infinity)).toBe(0);
    });
});

describe("CreaseCard", () => {
    it("renders title and meta", () => {
        render(<CreaseCard title="Saturday Powerplay" meta="South Delhi · 7.0km" current={7} required={11} />);
        expect(screen.getByText("Saturday Powerplay")).toBeInTheDocument();
        expect(screen.getByText("South Delhi · 7.0km")).toBeInTheDocument();
    });

    it("exposes squad state to assistive tech", () => {
        render(<CreaseCard title="Room" meta="m" current={7} required={11} />);
        expect(screen.getByRole("group")).toHaveAttribute("aria-label", "Room — 7 of 11 players");
    });

    it("marks a full squad as complete", () => {
        render(<CreaseCard title="Full" meta="m" current={11} required={11} />);
        expect(screen.getByRole("group")).toHaveAttribute("data-complete", "true");
    });

    it("marks an incomplete squad", () => {
        render(<CreaseCard title="Partial" meta="m" current={7} required={11} />);
        expect(screen.getByRole("group")).toHaveAttribute("data-complete", "false");
    });

    it("inks the crease in exact proportion to the squad", () => {
        render(<CreaseCard title="Room" meta="m" current={7} required={11} />);
        const stroke = screen.getByTestId("crease-stroke");
        // Pin pathLength explicitly: without it the dasharray is in user units
        // and the proportion is wrong at every aspect ratio - yet every other
        // assertion here would still pass.
        expect(stroke).toHaveAttribute("pathLength", "100");
        // 7/11 = 63.64% of the perimeter
        expect(stroke).toHaveAttribute("stroke-dasharray", "63.64 100");
    });

    it("closes the crease for a full squad", () => {
        render(<CreaseCard title="Full" meta="m" current={11} required={11} />);
        expect(screen.getByTestId("crease-stroke")).toHaveAttribute("stroke-dasharray", "100.00 100");
    });

    it("leaves the crease unmarked for an empty squad", () => {
        render(<CreaseCard title="Empty" meta="m" current={0} required={11} />);
        expect(screen.getByTestId("crease-stroke")).toHaveAttribute("stroke-dasharray", "0.00 100");
    });
});
```

- [ ] **Step 2: Run it — expect FAIL**

```bash
cd Client && npx vitest run src/components/ui/crease-card.test.tsx
```

Expected: FAIL — `Failed to resolve import "./crease-card"`.

- [ ] **Step 3: Implement `Client/src/components/ui/crease-card.tsx`**

The partial border is drawn as an SVG outline with `pathLength={100}`, which normalises the rectangle's perimeter to 100 units so `strokeDasharray` inks **exactly** `fill` of the border length at any aspect ratio.

A `conic-gradient` `border-image` is the obvious first idea and is wrong: it inks by *angle*, so on a 3:1 card 7/11 does not cover 63.6% of the border, and `border-image` also ignores `border-radius`, leaving this one card square-cornered while every other surface is 3px. Since the component's whole claim is "ink drawn equals squad filled", an approximation defeats it.

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

/** Fraction of the crease to ink, clamped to 0–1. Returns 0 when `required` is 0. */
export function creaseFill(current: number, required: number): number {
    if (!Number.isFinite(current) || !Number.isFinite(required) || required <= 0) return 0;
    if (current <= 0) return 0;
    if (current >= required) return 1;
    return current / required;
}

export interface CreaseCardProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    meta: string;
    current: number;
    required: number;
}

export const CreaseCard = React.forwardRef<HTMLDivElement, CreaseCardProps>(
    ({ title, meta, current, required, className, children, ...props }, ref) => {
        const fill = creaseFill(current, required);
        const complete = fill === 1;

        return (
            <div
                {...props}
                ref={ref}
                role="group"
                aria-label={`${title} — ${current} of ${required} players`}
                data-complete={complete ? "true" : "false"}
                className={cn("relative rounded bg-surface p-5", className)}
            >
                {/*
                  The crease. pathLength={100} normalises the rectangle's
                  perimeter to 100 units, so strokeDasharray inks exactly
                  `fill` of the border length regardless of aspect ratio.
                  strokeWidth 2 on the viewport edge leaves a crisp 1px after
                  the SVG clips the outer half. The faint rect underneath is
                  the unmarked crease, so a 0/11 card still reads as a card.
                */}
                <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
                    <rect x="0" y="0" width="100%" height="100%" rx="3" fill="none"
                          stroke="var(--rule-soft)" strokeWidth="2" />
                    <rect x="0" y="0" width="100%" height="100%" rx="3" fill="none"
                          stroke="var(--rule)" strokeWidth="2"
                          pathLength={100}
                          strokeDasharray={`${(fill * 100).toFixed(2)} 100`}
                          data-testid="crease-stroke" />
                </svg>

                <div className="relative">
                    <h3 className="font-display text-xl uppercase leading-none tracking-wide text-ink">{title}</h3>
                    <p className="mt-2 text-sm text-ink-soft">{meta}</p>
                    <p className="mt-3 font-data text-sm text-ink">
                        {current}/{required}
                        <span className="ml-2 text-ink-soft">
                            {complete ? "full" : `${Math.max(0, required - current)} needed`}
                        </span>
                    </p>
                    {children}
                </div>
            </div>
        );
    },
);
CreaseCard.displayName = "CreaseCard";
```

- [ ] **Step 4: Run the test — expect PASS**

```bash
cd Client && npx vitest run src/components/ui/crease-card.test.tsx
```

Expected: `14 passed`.

- [ ] **Step 5: Typecheck and lint**

```bash
cd Client && npx tsc --noEmit && npx eslint src/components/ui/crease-card.tsx
```

Expected: both exit 0.

- [ ] **Step 6: Commit**

```bash
git add Client/src/components/ui/crease-card.tsx Client/src/components/ui/crease-card.test.tsx
git commit -m "feat(ui): add CreaseCard, the Maidan signature component

Squad completion is encoded as how much of the card's border is inked,
derived from PlayRoom.currentPlayers / requiredPlayers. Fill math is
clamped and guards divide-by-zero."
```

---

### Task 6: `DataTable` — the tabular system

Replaces the four-across `MetricCard` grids that can't be scanned or compared.

**Files:**
- Create: `Client/src/components/ui/data-table.tsx`
- Test: `Client/src/components/ui/data-table.test.tsx`

**Interfaces:**
- Consumes: tokens (Task 3).
- Produces: `DataTable<T>` taking `columns: Column<T>[]`, `rows: T[]`, `getRowId: (row: T) => string`, `emptyMessage?: ReactNode`, `loading?: boolean`, `skeletonRows?: number`. `Column<T> = { key, header, align?: "left" | "right", numeric?: boolean, render: (row: T) => ReactNode }`.

- [ ] **Step 1: Write the failing test**

Create `Client/src/components/ui/data-table.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DataTable, type Column } from "./data-table";

type Room = { id: string; name: string; distanceKm: number; spots: string };

const columns: Column<Room>[] = [
    { key: "name", header: "Room", render: (r) => r.name },
    { key: "dist", header: "Dist", align: "right", numeric: true, render: (r) => `${r.distanceKm.toFixed(1)}km` },
    { key: "spots", header: "Spots", align: "right", numeric: true, render: (r) => r.spots },
];

const rows: Room[] = [
    { id: "1", name: "Saturday Powerplay", distanceKm: 7, spots: "4/11" },
    { id: "2", name: "Need 2 Finishers", distanceKm: 9.2, spots: "2/11" },
];

describe("DataTable", () => {
    it("renders headers", () => {
        render(<DataTable columns={columns} rows={rows} getRowId={(r) => r.id} />);
        expect(screen.getByRole("columnheader", { name: "Room" })).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "Dist" })).toBeInTheDocument();
    });

    it("renders a row per item", () => {
        render(<DataTable columns={columns} rows={rows} getRowId={(r) => r.id} />);
        expect(screen.getAllByRole("row")).toHaveLength(3); // header + 2
    });

    it("formats numeric cells with the data font and tabular figures", () => {
        render(<DataTable columns={columns} rows={rows} getRowId={(r) => r.id} />);
        const cell = screen.getByText("7.0km");
        expect(cell).toHaveClass("font-data");
        expect(cell).toHaveClass("tabular-nums");
    });

    it("leaves non-numeric cells in the body font", () => {
        render(<DataTable columns={columns} rows={rows} getRowId={(r) => r.id} />);
        // Guards against slapping font-data on every cell, which would make
        // the numeric/non-numeric distinction meaningless.
        expect(screen.getByText("Saturday Powerplay")).not.toHaveClass("font-data");
    });

    it("right-aligns a numeric column even when align is omitted", () => {
        const cols: Column<Room>[] = [
            { key: "dist", header: "Dist", numeric: true, render: (r) => `${r.distanceKm.toFixed(1)}km` },
        ];
        render(<DataTable columns={cols} rows={rows} getRowId={(r) => r.id} />);
        expect(screen.getByText("7.0km")).toHaveClass("text-right");
    });

    it("right-aligns numeric columns and left-aligns the rest", () => {
        render(<DataTable columns={columns} rows={rows} getRowId={(r) => r.id} />);
        expect(screen.getByText("7.0km")).toHaveClass("text-right");
        expect(screen.getByText("Saturday Powerplay")).not.toHaveClass("text-right");
    });

    it("shows the empty message when there are no rows", () => {
        render(
            <DataTable
                columns={columns}
                rows={[]}
                getRowId={(r) => r.id}
                emptyMessage="No rooms within 10km. Widen to 25km, or start one."
            />,
        );
        expect(screen.getByText(/No rooms within 10km/)).toBeInTheDocument();
    });

    it("renders skeleton rows while loading", () => {
        render(<DataTable columns={columns} rows={[]} getRowId={(r) => r.id} loading skeletonRows={3} />);
        expect(screen.getAllByTestId("skeleton-row")).toHaveLength(3);
    });

    it("prefers skeletons over the empty message while loading", () => {
        render(
            <DataTable columns={columns} rows={[]} getRowId={(r) => r.id} loading emptyMessage="nothing here" />,
        );
        expect(screen.queryByText("nothing here")).not.toBeInTheDocument();
    });
});
```

- [ ] **Step 2: Run it — expect FAIL**

```bash
cd Client && npx vitest run src/components/ui/data-table.test.tsx
```

Expected: FAIL — `Failed to resolve import "./data-table"`.

- [ ] **Step 3: Implement `Client/src/components/ui/data-table.tsx`**

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface Column<T> {
    key: string;
    header: string;
    align?: "left" | "right";
    /** Renders in the tabular mono face with tabular-nums. */
    numeric?: boolean;
    render: (row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
    columns: Column<T>[];
    rows: T[];
    getRowId: (row: T) => string;
    emptyMessage?: React.ReactNode;
    loading?: boolean;
    skeletonRows?: number;
    className?: string;
}

export function DataTable<T>({
    columns,
    rows,
    getRowId,
    emptyMessage = "Nothing here yet.",
    loading = false,
    skeletonRows = 5,
    className,
}: DataTableProps<T>) {
    // `numeric` implies right alignment unless the caller says otherwise.
    // Place-value alignment is the point of this component; a caller who sets
    // numeric but forgets align should not silently lose it.
    const alignOf = (col: Column<T>) => col.align ?? (col.numeric ? "right" : "left");

    const cellClass = (col: Column<T>) =>
        cn(
            "px-3 py-2.5 text-sm",
            alignOf(col) === "right" && "text-right",
            col.numeric && "font-data tabular-nums",
        );

    let body: React.ReactNode;
    if (loading) {
        body = Array.from({ length: skeletonRows }, (_, i) => (
            <tr key={i} data-testid="skeleton-row" className="border-b border-rule-soft">
                {columns.map((col) => (
                    <td key={col.key} className={cellClass(col)}>
                        <span className="inline-block h-3 w-16 bg-surface-sunk" aria-hidden="true" />
                    </td>
                ))}
            </tr>
        ));
    } else if (rows.length === 0) {
        body = (
            <tr>
                <td colSpan={columns.length} className="px-3 py-10 text-center text-sm text-ink-soft">
                    {emptyMessage}
                </td>
            </tr>
        );
    } else {
        body = rows.map((row) => (
            <tr key={getRowId(row)} className="border-b border-rule-soft last:border-b-0">
                {columns.map((col) => (
                    // cellClass already carries font-data / text-right;
                    // an inner <span> repeating them would be duplication.
                    <td key={col.key} className={cellClass(col)}>
                        {col.render(row)}
                    </td>
                ))}
            </tr>
        ));
    }

    return (
        <div className={cn("w-full overflow-x-auto border border-rule bg-surface", className)}>
            <table className="w-full border-collapse" aria-busy={loading}>
                <thead>
                    <tr className="border-b border-rule">
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                scope="col"
                                className={cn(
                                    "px-3 py-2 text-xs font-semibold uppercase tracking-wide text-ink-soft",
                                    alignOf(col) === "right" ? "text-right" : "text-left",
                                )}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>{body}</tbody>
            </table>
            {loading ? (
                <span role="status" aria-live="polite" className="sr-only">
                    Loading
                </span>
            ) : null}
        </div>
    );
}
```

- [ ] **Step 4: Run the test — expect PASS**

```bash
cd Client && npx vitest run src/components/ui/data-table.test.tsx
```

Expected: `9 passed`.

- [ ] **Step 5: Typecheck, lint, commit**

```bash
cd Client && npx tsc --noEmit && npx eslint src/components/ui/data-table.tsx
git add Client/src/components/ui/data-table.tsx Client/src/components/ui/data-table.test.tsx
git commit -m "feat(ui): add DataTable with tabular numerals and skeleton loading

Column-locked, right-aligned numerics in the mono face. Replaces the
four-across MetricCard grids that could not be scanned or compared.
Includes designed empty and loading states."
```

---

### Task 7: Server — consolidate booking models and fix owner revenue

Gap #13: `getOwnerAnalytics` counts bookings from `ground.bookings + structuredBookings.length` but sums revenue only from `bookingRecords`, so **every structured `Booking` contributes ₹0**. The failing test written here is the proof the defect existed.

**Files:**
- Modify: `Server/src/modules/analytics/analytics.service.ts:5-40`
- Create: `Server/src/modules/analytics/analytics.service.test.ts`

**Interfaces:**
- Consumes: Prisma models `OwnerProfile`, `Ground`, `Booking`, `PaymentRecord`, `GroundBooking`.
- Produces: `computeGroundRevenue(ground)` — a pure function taking `{ bookingRecords, structuredBookings }` and returning `{ bookings: number; revenue: number }`, unit-testable without a database.

- [ ] **Step 1: Write the failing test**

Create `Server/src/modules/analytics/analytics.service.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { computeGroundRevenue } from "./analytics.service";

describe("computeGroundRevenue", () => {
    it("counts legacy GroundBooking revenue", () => {
        const result = computeGroundRevenue({
            bookingRecords: [{ amount: 5000 }, { amount: 3000 }],
            structuredBookings: [],
        });
        expect(result.revenue).toBe(8000);
        expect(result.bookings).toBe(2);
    });

    // This is the regression this task exists to fix.
    it("counts structured Booking revenue from SUCCEEDED payments", () => {
        const result = computeGroundRevenue({
            bookingRecords: [],
            structuredBookings: [
                { payments: [{ amount: 4000, status: "SUCCEEDED" }] },
                { payments: [{ amount: 2500, status: "SUCCEEDED" }] },
            ],
        });
        expect(result.revenue).toBe(6500);
        expect(result.bookings).toBe(2);
    });

    it("ignores failed and pending payments", () => {
        const result = computeGroundRevenue({
            bookingRecords: [],
            structuredBookings: [
                { payments: [{ amount: 4000, status: "FAILED" }] },
                { payments: [{ amount: 1000, status: "REQUIRES_ACTION" }] },
                { payments: [{ amount: 2000, status: "SUCCEEDED" }] },
            ],
        });
        expect(result.revenue).toBe(2000);
    });

    it("sums legacy and structured revenue together", () => {
        const result = computeGroundRevenue({
            bookingRecords: [{ amount: 1000 }],
            structuredBookings: [{ payments: [{ amount: 2000, status: "SUCCEEDED" }] }],
        });
        expect(result.revenue).toBe(3000);
        expect(result.bookings).toBe(2);
    });

    it("returns zeroes for a ground with no bookings", () => {
        const result = computeGroundRevenue({ bookingRecords: [], structuredBookings: [] });
        expect(result).toEqual({ bookings: 0, revenue: 0 });
    });
});
```

- [ ] **Step 2: Run it — expect FAIL**

```bash
cd Server && npx vitest run src/modules/analytics/analytics.service.test.ts
```

Expected: FAIL — `computeGroundRevenue` is not exported.

- [ ] **Step 3: Implement `computeGroundRevenue` and use it**

In `Server/src/modules/analytics/analytics.service.ts`, add above the class:

```ts
type RevenueInput = {
    bookingRecords: { amount: number }[];
    structuredBookings: { payments: { amount: number; status: string }[] }[];
};

/**
 * Single source of truth for ground revenue.
 *
 * Previously revenue summed only `bookingRecords` (legacy GroundBooking)
 * while the booking *count* included structured bookings — so every
 * structured Booking contributed zero revenue. See docs/PLAN.md §3 gap #13.
 *
 * This also stops counting the denormalized `Ground.bookings` column. That
 * column is only ever written at ground creation from `data.bookings ?? 0`
 * and is never incremented when a booking is made, so adding it to the count
 * mixed an owner-supplied arbitrary number into a real total. Counts are now
 * derived purely from booking rows.
 */
export function computeGroundRevenue(ground: RevenueInput): { bookings: number; revenue: number } {
    const legacyRevenue = ground.bookingRecords.reduce((sum, b) => sum + b.amount, 0);

    const structuredRevenue = ground.structuredBookings.reduce(
        (sum, booking) =>
            sum +
            booking.payments
                .filter((p) => p.status === "SUCCEEDED")
                .reduce((pSum, p) => pSum + p.amount, 0),
        0,
    );

    return {
        bookings: ground.bookingRecords.length + ground.structuredBookings.length,
        revenue: legacyRevenue + structuredRevenue,
    };
}
```

Then replace the body of `getOwnerAnalytics`'s ground mapping. The Prisma query must now include payments:

```ts
async getOwnerAnalytics(userId: string) {
    const owner = await prisma.ownerProfile.findUnique({
        where: { userId },
        include: {
            grounds: {
                include: {
                    bookingRecords: true,
                    structuredBookings: { include: { payments: true } },
                },
            },
        },
    });

    if (!owner) {
        throw new Error("Owner profile not found");
    }

    const grounds = owner.grounds.map((ground) => {
        const { bookings, revenue } = computeGroundRevenue(ground);
        return {
            id: ground.id,
            name: ground.name,
            bookings,
            revenue,
            occupancyLabel: `${ground.structuredBookings.length} structured bookings`,
        };
    });

    return {
        totalGrounds: grounds.length,
        totalBookings: grounds.reduce((sum, g) => sum + g.bookings, 0),
        totalRevenue: grounds.reduce((sum, g) => sum + g.revenue, 0),
        grounds,
    };
}
```

- [ ] **Step 4: Run the test — expect PASS**

```bash
cd Server && npx vitest run src/modules/analytics/analytics.service.test.ts
```

Expected: `5 passed`.

- [ ] **Step 5: Typecheck**

```bash
cd Server && npx tsc --noEmit
```

Expected: exit 0. If Prisma complains that `payments` is not a valid include on `structuredBookings`, run `npx prisma generate` first — the relation exists on the `Booking` model as `payments PaymentRecord[]`.

- [ ] **Step 6: Mark the legacy model deprecated**

In `Server/prisma/schema.prisma`, add a comment above `model GroundBooking`:

```prisma
/// DEPRECATED — superseded by Booking + PaymentRecord.
/// Retained so historical revenue survives; no new rows should be written.
/// Removal is tracked in P0b. See docs/PLAN.md §3 gap #14.
model GroundBooking {
```

- [ ] **Step 7: Commit**

```bash
git add Server/src/modules/analytics/analytics.service.ts Server/src/modules/analytics/analytics.service.test.ts Server/prisma/schema.prisma
git commit -m "fix(analytics): count structured bookings in owner revenue

Revenue summed only legacy GroundBooking rows while the booking count
included structured Bookings, so every structured booking contributed
zero revenue. Revenue now sums legacy amounts plus SUCCEEDED
PaymentRecords, extracted into a pure, unit-tested function.

Marks GroundBooking deprecated."
```

---

### Task 8: App scaffolding and a working 401 handler

Gap #10: `auth:unauthorized` is dispatched into an empty handler, so 401s do nothing.

**Files:**
- Create: `Client/src/app/providers.tsx`
- Create: `Client/src/app/router.tsx`
- Create: `Client/src/lib/auth-events.ts`
- Create: `Client/src/lib/auth-events.test.ts`
- Modify: `Client/src/main.tsx`
- Modify: `Client/src/redux/store.ts` (export `persistor` — verify it already does)

**Interfaces:**
- Consumes: `store`, `persistor`, `queryClient`, `ErrorBoundary`.
- Produces: `AUTH_UNAUTHORIZED_EVENT` constant, `onUnauthorized(handler): () => void` returning an unsubscribe function, `<Providers>`, and `router`.

- [ ] **Step 1: Write the failing test**

Create `Client/src/lib/auth-events.test.ts`:

```ts
import { describe, it, expect, vi } from "vitest";
import { AUTH_UNAUTHORIZED_EVENT, onUnauthorized } from "./auth-events";

describe("auth events", () => {
    it("invokes the handler when the event fires", () => {
        const handler = vi.fn();
        const off = onUnauthorized(handler);
        window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT));
        expect(handler).toHaveBeenCalledOnce();
        off();
    });

    it("stops invoking after unsubscribe", () => {
        const handler = vi.fn();
        const off = onUnauthorized(handler);
        off();
        window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT));
        expect(handler).not.toHaveBeenCalled();
    });

    it("supports multiple subscribers", () => {
        const a = vi.fn();
        const b = vi.fn();
        const offA = onUnauthorized(a);
        const offB = onUnauthorized(b);
        window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT));
        expect(a).toHaveBeenCalledOnce();
        expect(b).toHaveBeenCalledOnce();
        offA();
        offB();
    });
});
```

- [ ] **Step 2: Run it — expect FAIL**

```bash
cd Client && npx vitest run src/lib/auth-events.test.ts
```

Expected: FAIL — `Failed to resolve import "./auth-events"`.

- [ ] **Step 3: Create `Client/src/lib/auth-events.ts`**

```ts
export const AUTH_UNAUTHORIZED_EVENT = "auth:unauthorized";

/** Subscribe to global 401s. Returns an unsubscribe function. */
export function onUnauthorized(handler: () => void): () => void {
    const listener = () => handler();
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, listener);
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, listener);
}

export function emitUnauthorized(): void {
    window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT));
}
```

- [ ] **Step 4: Run the test — expect PASS**

```bash
cd Client && npx vitest run src/lib/auth-events.test.ts
```

Expected: `3 passed`.

- [ ] **Step 5: Use the helper in the API client**

In `Client/src/lib/api.ts`, replace the inline dispatch inside the 401 branch with the helper:

```ts
import { emitUnauthorized } from "./auth-events";
```

and in the interceptor:

```ts
            if (status === 401) {
                emitUnauthorized();
            }
```

- [ ] **Step 6: Create `Client/src/app/providers.tsx` with a real 401 handler**

```tsx
import { type ReactNode, useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import store, { persistor } from "../redux/store";
import { queryClient } from "../lib/queryClient";
import { onUnauthorized } from "../lib/auth-events";
import { clearUser } from "../redux/userSlice";

function UnauthorizedListener() {
    useEffect(
        () =>
            onUnauthorized(() => {
                store.dispatch(clearUser());
                queryClient.clear();
                void persistor.purge();
                const { pathname, search } = window.location;
                if (pathname !== "/login") {
                    const next = encodeURIComponent(pathname + search);
                    window.location.assign(`/login?next=${next}`);
                }
            }),
        [],
    );
    return null;
}

export function Providers({ children }: { children: ReactNode }) {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <QueryClientProvider client={queryClient}>
                    <UnauthorizedListener />
                    {children}
                    <Toaster position="top-right" richColors />
                </QueryClientProvider>
            </PersistGate>
        </Provider>
    );
}
```

> Verified present: `userSlice.ts` exports both `setUser` and `clearUser`; `store.ts` exports `persistor`. `clearUser()` is the correct logout action — do not use `setUser(null)`, which would fight the slice's typing. `persistor.purge()` clears the persisted copy so a reload cannot resurrect the logged-out user.

- [ ] **Step 7: Move the router into `Client/src/app/router.tsx`**

Cut the `lazy(...)` imports, `RouteFallback`, `lazyRoute`, and `createBrowserRouter` call out of `main.tsx` into `router.tsx`, exporting `router`. Replace the fallback with a token-styled one:

```tsx
const RouteFallback = () => (
    <div className="flex min-h-[50vh] items-center justify-center text-sm text-ink-soft">Loading…</div>
);
```

Keep the route table exactly as it is — route changes are not in scope for P0a.

- [ ] **Step 8: Slim `Client/src/main.tsx` to a mount point**

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { Providers } from "./app/providers";
import { router } from "./app/router";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
    <StrictMode>
        <ErrorBoundary>
            <Providers>
                <RouterProvider router={router} />
            </Providers>
        </ErrorBoundary>
    </StrictMode>,
);
```

**Keep `axios.defaults.withCredentials = true` for now**, moved into `app/providers.tsx` with a deprecation comment. Fourteen components still import raw `axios` — `BookingsHub`, `Discover`, `Grouds`, `Matchups`, `Navbar`, `OrganizerAnalytics`, `OwnerAnalytics`, `PlayerProfile`, `RegisterTour`, `RoomsHub`, `SignUp`, `StripeCheckoutWrapper`, `TournamentHostingForm`, `Tours` — and they all depend on that global to send the auth cookie. Deleting it here would silently break every authenticated request in all fourteen for the five tasks until they migrate, and the failure mode is a 401 at runtime, not a build error.

Add this near the top of `app/providers.tsx`:

```ts
import axios from "axios";

// DEPRECATED - 14 legacy components still call raw axios and rely on this
// global to send the auth cookie. They migrate to the typed `api` client in
// Tasks 9-13; Task 13 removes this line once none remain. Do not add new
// raw-axios callers.
axios.defaults.withCredentials = true;
```

- [ ] **Step 9: Verify**

```bash
cd Client && npx tsc --noEmit && npx vitest run && npx vite build
```

Expected: typecheck 0, all tests pass, build succeeds.

- [ ] **Step 10: Commit**

```bash
git add Client/src/app Client/src/lib/auth-events.ts Client/src/lib/auth-events.test.ts Client/src/lib/api.ts Client/src/main.tsx
git commit -m "feat(app): extract providers/router, implement the 401 handler

auth:unauthorized was dispatched into an empty handler, so 401s did
nothing. It now clears user state, clears the query cache, purges the
persisted copy, and redirects to /login with a return path.

axios.defaults.withCredentials MOVES to app/providers.tsx rather than
being removed - 14 components still use raw axios and need it until
Task 13."
```

---

### Tasks 9–13: Feature migration (move + convert in one touch)

Each task moves a group of components from flat `components/` into `features/`, converts `.jsx → .tsx`, and replaces deleted CSS classes with token utilities. **Move and convert together** so each file is touched once.

**Shared procedure for every task in this group:**

1. `git mv` each file to its feature directory, renaming `.jsx → .tsx`.
2. Add explicit prop types; remove `prop-types` usage; remove unused `React` imports.
3. Replace deleted classes using the mapping below.
4. Replace raw `axios` calls with the typed `api` client from `@/lib/api`.
5. Update importers (`src/app/router.tsx`, `Layout.jsx`, parents).
6. Run `npx tsc --noEmit && npx eslint <new paths> && npx vitest run && npx vite build`.
7. Commit.

**Class replacement mapping** (from the Task 3 Step 4 inventory):

| Deleted class | Replacement |
|---|---|
| `product-page` | `min-h-screen px-4 pb-16 pt-28 md:px-8 lg:px-12` |
| `product-shell` | `mx-auto max-w-7xl space-y-6` |
| `product-panel` | `border border-rule bg-surface rounded` |
| `product-hero` | `border border-rule bg-surface rounded p-6 md:p-8 lg:p-10` |
| `product-card`, `stat-card` | `border border-rule bg-surface rounded p-5` |
| `product-grid` | `grid gap-4 md:gap-5` |
| `product-grid-2` | `grid gap-4 md:gap-5 grid-cols-1 lg:grid-cols-2` |
| `product-grid-3` | `grid gap-4 md:gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3` |
| `product-grid-4` | `grid gap-4 md:gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4` |
| `section-kicker` | `mb-3 text-xs font-semibold uppercase tracking-widest text-ink-soft` |
| `section-title` | `font-display text-2xl uppercase tracking-wide md:text-3xl` |
| `section-copy` | `mt-3 max-w-3xl text-sm leading-7 text-ink-soft md:text-base` |
| `display-title` | `font-display text-4xl uppercase leading-none tracking-wide md:text-5xl xl:text-6xl` |
| `stat-value` | `mt-3 block font-data text-3xl tabular-nums text-ink` |
| `muted-copy` | `text-ink-soft` |
| `pill-accent` | `<Badge tone="go">` |
| `pill-gold` | `<Badge tone="pending">` |
| `standard-input` | `<Input />` |
| `standard-select` | `<select className="h-10 w-full rounded border border-rule bg-surface px-3 text-sm text-ink">` |
| `standard-textarea` | `<Textarea />` |
| `cta-primary` | `<Button>` (or `<Button asChild><Link …>`) |
| `cta-secondary` | `<Button variant="outline">` |
| `surface-divider` | `border-rule-soft` |
| `font-cabinet-black`, `-extrabold` | `font-display` |
| `font-cabinet*` (other weights) | `font-body` |
| `text-[#d8b56d]`, `text-[#f0ddb0]` | `text-pending` |
| `bg-white/5`, `bg-white/10` | `bg-surface-sunk` |
| `border-white/10` | `border-rule-soft` |
| `text-white/40`, `/60`, `/85` | `text-ink-soft` |

---

### Task 9: `features/marketing/` and `features/auth/`

**Files:**
- Move: `components/{Hero,Join,ServicesHub,Upcoming,Matchups,About,About_cric,Joinus,WhyCricArena,Footer,CricketStumps}.jsx` → `features/marketing/*.tsx`
- Move: `components/Landing.tsx` → `features/marketing/Landing.tsx`
- Move: `components/{Login.tsx,SignUp.jsx}` → `features/auth/*.tsx`
- Modify: `Client/src/app/router.tsx`, `Client/src/components/Layout.jsx`

**Interfaces:**
- Consumes: primitives from Tasks 4–6, tokens from Task 3.
- Produces: `features/marketing/Landing.tsx` default export (used by `App.tsx`); `features/auth/Login.tsx` and `features/auth/SignUp.tsx` default exports (used by the router).

- [ ] **Step 1: Move the marketing components**

```bash
cd Client/src && mkdir -p features/marketing
for f in Hero Join ServicesHub Upcoming Matchups About About_cric Joinus WhyCricArena Footer CricketStumps; do
  git mv components/$f.jsx features/marketing/$f.tsx
done
git mv components/Landing.tsx features/marketing/Landing.tsx
```

- [ ] **Step 2: Move the auth components**

```bash
cd Client/src && git mv components/Login.tsx features/auth/Login.tsx && git mv components/SignUp.jsx features/auth/SignUp.tsx
```

- [ ] **Step 3: Fix each moved file**

For every file: add prop types, delete unused `React` imports, apply the class mapping, and fix relative imports (`../assets/x.png` becomes `../../assets/x.png` — one level deeper). `Landing.tsx` imports its siblings from `./` rather than `../components/`.

- [ ] **Step 4: Update importers**

In `Client/src/App.tsx`, change `import Landing from "./components/Landing"` to `import Landing from "./features/marketing/Landing"`.

In `Client/src/app/router.tsx`, update the `Login`, `SignUp`, and `About_cric` lazy imports to their new paths.

In `Client/src/components/Layout.jsx`, update the `Footer` import.

- [ ] **Step 5: Verify**

```bash
cd Client && npx tsc --noEmit && npx eslint src/features && npx vitest run && npx vite build
```

Expected: all four green. Lint errors inside `src/features` must be **0**.

- [ ] **Step 6: Commit**

```bash
git add -A Client/src
git commit -m "refactor(client): move marketing and auth into feature modules, convert to TS"
```

---

### Task 10: `features/discovery/` and `features/rooms/`

`Discover.jsx` is 478 lines mixing fetch, filter state, business rules, and presentation. Split it.

**Files:**
- Create: `features/discovery/DiscoverPage.tsx`, `features/discovery/discovery.api.ts`, `features/discovery/discovery.types.ts`, `features/discovery/RoomTable.tsx`
- Delete: `components/Discover.jsx`
- Move: `components/RoomsHub.jsx` → `features/rooms/RoomsHub.tsx`
- Modify: `Client/src/app/router.tsx`

**Interfaces:**
- Consumes: `DataTable`, `Column` (Task 6); `CreaseCard` (Task 5); `api` from `@/lib/api`.
- Produces: `DiscoverPage` default export; `fetchDiscoveryFeed(filters): Promise<DiscoveryFeed>`; types `PlayRoomSummary` and `DiscoveryFeed`.

- [ ] **Step 1: Define the types**

Create `features/discovery/discovery.types.ts`:

```ts
export interface PlayRoomSummary {
    id: string;
    title: string;
    city: string | null;
    distanceKm: number | null;
    currentPlayers: number;
    requiredPlayers: number;
    skillLevel: string | null;
    matchDate: string | null;
}

export interface ActivePlayerSummary {
    id: string;
    userId: string;
    skillLevel: string | null;
    preferredRoles: string[];
    availabilityType: string;
    distanceKm: number | null;
    user: { id: string; fullname: string; city: string; state: string };
}

/** Mirrors the server envelope exactly — see note below. */
export interface DiscoveryFeed {
    rooms: PlayRoomSummary[];
    activePlayers: ActivePlayerSummary[];
}

/** Mirrors `discoveryFeedQuerySchema` in Server/src/modules/discovery/discovery.schemas.ts. */
export interface DiscoveryFilters {
    latitude?: number;
    longitude?: number;
    radiusKm?: number;
    city?: string;
    state?: string;
    sport?: "CRICKET";
}
```

**The contract, read off the server — do not re-derive it:**

- Endpoint is `GET /discovery/feed`, and it is **not** behind `authentication` (see `discovery.routes.ts`).
- The controller responds `res.json({ success: true, ...feed })`, so `rooms` and `activePlayers` are **top-level keys, not nested under `data`**. An `api.get<{data: T}>(...).data.data` access would be `undefined`.
- The key is `activePlayers`, not `players`.
- `distanceKm` is present **only when both `latitude` and `longitude` are supplied**; without coordinates the service returns rows unfiltered and with no `distanceKm` field at all. Treat it as `number | null | undefined` at the edge and render `"—"` when absent.
- Each room is the full Prisma `PlayRoom` row plus `distanceKm`, and carries an `members` array of approved members.

- [ ] **Step 2: Create the API module**

Create `features/discovery/discovery.api.ts`:

```ts
import { api } from "@/lib/api";
import type { DiscoveryFeed, DiscoveryFilters } from "./discovery.types";

export async function fetchDiscoveryFeed(filters: DiscoveryFilters): Promise<DiscoveryFeed> {
    // The server spreads the feed into the envelope:
    //   res.json({ success: true, ...feed })
    // so `rooms` / `activePlayers` sit at the top level, NOT under `data`.
    const { data } = await api.get<{ success: boolean } & DiscoveryFeed>("/discovery/feed", {
        params: filters,
    });
    return { rooms: data.rooms ?? [], activePlayers: data.activePlayers ?? [] };
}
```

- [ ] **Step 3: Create the table view**

Create `features/discovery/RoomTable.tsx`:

```tsx
import { DataTable, type Column } from "@/components/ui/data-table";
import type { PlayRoomSummary } from "./discovery.types";

const columns: Column<PlayRoomSummary>[] = [
    { key: "title", header: "Room", render: (r) => r.title },
    {
        key: "dist",
        header: "Dist",
        align: "right",
        numeric: true,
        // distanceKm is absent entirely when the caller sent no coordinates.
        render: (r) => (r.distanceKm == null ? "—" : `${r.distanceKm.toFixed(1)}km`),
    },
    {
        key: "spots",
        header: "Spots",
        align: "right",
        numeric: true,
        render: (r) =>
            r.currentPlayers >= r.requiredPlayers ? "full" : `${r.currentPlayers}/${r.requiredPlayers}`,
    },
    { key: "skill", header: "Skill", render: (r) => r.skillLevel ?? "mixed" },
    { key: "when", header: "When", render: (r) => (r.matchDate ? new Date(r.matchDate).toLocaleString() : "flexible") },
];

export function RoomTable({ rooms, loading }: { rooms: PlayRoomSummary[]; loading: boolean }) {
    return (
        <DataTable
            columns={columns}
            rows={rooms}
            getRowId={(r) => r.id}
            loading={loading}
            emptyMessage="No rooms in range. Widen your radius, or start one."
        />
    );
}
```

- [ ] **Step 4: Create the page container**

Create `features/discovery/DiscoverPage.tsx` holding only filter state and the query, delegating rendering to `RoomTable`. Port the real filter controls out of the old `Discover.jsx` before deleting it, replacing `standard-input`/`standard-select` with `<Input>`/`<select>` per the mapping.

- [ ] **Step 5: Delete the old component and move RoomsHub**

```bash
cd Client/src && git rm components/Discover.jsx && mkdir -p features/rooms && git mv components/RoomsHub.jsx features/rooms/RoomsHub.tsx
```

- [ ] **Step 6: Update the router**

In `Client/src/app/router.tsx`:

```tsx
const DiscoverPage = lazy(() => import("../features/discovery/DiscoverPage"));
const RoomsHub = lazy(() => import("../features/rooms/RoomsHub"));
```

- [ ] **Step 7: Verify and commit**

```bash
cd Client && npx tsc --noEmit && npx eslint src/features && npx vitest run && npx vite build
git add -A Client/src
git commit -m "refactor(client): split Discover into discovery feature module

478-line component mixing fetch, filter state, business rules, and
presentation becomes DiscoverPage (state) + RoomTable (view) +
discovery.api/types. Room list now renders through DataTable."
```

---

### Task 11: `features/grounds/` and `features/bookings/`

The Stripe flow is the riskiest port in this plan — there are no tests covering it and it handles money. Change paths and class names **only**; do not refactor payment logic.

**Files:**
- Move: `components/Grouds.jsx` → `features/grounds/GroundsPage.tsx` (fixing the typo)
- Move: `components/{BookingsHub,CheckoutPage,StripeCheckoutWrapper}.jsx` → `features/bookings/*.tsx`
- Move: `utils/payment.js` → `features/bookings/payment.ts`
- Modify: `Client/src/app/router.tsx`

**Interfaces:**
- Consumes: `api`, `Button`, `Input`, `DataTable`, `Badge`.
- Produces: `GroundsPage`, `BookingsHub`, `CheckoutPage` default exports.

- [ ] **Step 1: Move the files**

```bash
cd Client/src && mkdir -p features/grounds features/bookings
git mv components/Grouds.jsx features/grounds/GroundsPage.tsx
git mv components/BookingsHub.jsx features/bookings/BookingsHub.tsx
git mv components/CheckoutPage.jsx features/bookings/CheckoutPage.tsx
git mv components/StripeCheckoutWrapper.jsx features/bookings/StripeCheckoutWrapper.tsx
git mv utils/payment.js features/bookings/payment.ts
```

- [ ] **Step 2: Type `payment.ts`**

Add explicit parameter and return types. Keep every Stripe call byte-identical.

- [ ] **Step 3: Fix the Stripe Elements appearance (carried over from Task 2)**

`StripeCheckoutWrapper` hardcodes the **old dark palette** inside `cardElementOptions.style`:

```js
color: "#f5efe3",
fontFamily: "CabinetGrotesk-Medium, sans-serif",   // font deleted in Task 2
"::placeholder": { color: "rgba(245, 239, 227, 0.45)" },
```

Two defects. The font no longer exists. And `#f5efe3` is near-white — against the new `--surface` (`#FAF7F0`) the card input renders **invisible**. This must be fixed here or checkout silently breaks.

Stripe Elements renders inside an iframe and **cannot read CSS custom properties** from the parent page, so these must be literal values. To keep them out of Layer 3 (where Task 15's lint rule bans raw hex), put them in the design layer.

Create `Client/src/design/stripe-appearance.ts`:

```ts
/**
 * Literal Maidan values for Stripe Elements.
 *
 * Elements renders in a cross-origin iframe and cannot resolve CSS custom
 * properties from this document, so these cannot be var(--ink) etc.
 * They live here, in the design layer, so the values stay in one place and
 * Layer 3 still never writes a colour. Keep in sync with design/tokens.css.
 */
export const stripeCardStyle = {
    base: {
        color: "#2B2520", // --ink
        fontFamily: '"Inter Tight", system-ui, sans-serif', // --font-body
        fontSize: "16px",
        "::placeholder": {
            color: "#A79D90", // --ink-faint
        },
    },
    invalid: {
        color: "#A32A1F", // --urgent
        iconColor: "#A32A1F",
    },
} as const;
```

In `StripeCheckoutWrapper.tsx`, delete the inline `cardElementOptions.style` object and import it:

```ts
import { stripeCardStyle } from "@/design/stripe-appearance";
```

Keep every other key of `cardElementOptions` exactly as it was.

- [ ] **Step 4: Convert the three booking components**

Add prop types, apply the class mapping, switch raw `axios` to `api`. **Do not alter** PaymentIntent creation, Elements configuration beyond the `style` object replaced in Step 3, or `confirmPayment` arguments.

- [ ] **Step 5: Update the router**

```tsx
const GroundsPage = lazy(() => import("../features/grounds/GroundsPage"));
const BookingsHub = lazy(() => import("../features/bookings/BookingsHub"));
const CheckoutPage = lazy(() => import("../features/bookings/CheckoutPage"));
```

- [ ] **Step 6: Verify, including a manual payment smoke test**

```bash
cd Client && npx tsc --noEmit && npx eslint src/features && npx vitest run && npx vite build
```

Then **manually**, with the server running and Stripe in test mode: open `/grounds`, pick a ground and slot, reach checkout, pay with `4242 4242 4242 4242`, and confirm the booking appears in `/bookings`. Automated coverage for this flow is not in P0a — this manual pass is the gate.

**Look at the card input specifically.** Confirm the typed digits are dark on the light surface and the placeholder is legible. That is the Step 3 fix being verified; a passing payment with invisible text is still a failure.

- [ ] **Step 7: Commit**

```bash
git add -A Client/src
git commit -m "refactor(client): move grounds and bookings into feature modules

Path and styling changes only — Stripe PaymentIntent creation, Elements
config, and confirmPayment arguments are unchanged. Manually verified
end-to-end against Stripe test mode."
```

---

### Task 12: `features/tournaments/` and `features/profile/`

**Files:**
- Move: `components/{Tours,TournamentDetails,RegisterTour,TournamentHostingForm,TicketBookingForm}.jsx` → `features/tournaments/*.tsx`
- Move: `components/{PlayerProfile,PlayerRegistrationForm}.jsx` → `features/profile/*.tsx`
- Create: `features/profile/ProfileStats.tsx`, `features/profile/ProfileTeams.tsx`
- Modify: `Client/src/app/router.tsx`

**Interfaces:**
- Consumes: `api`, `Card`, `Button`, `Input`, `Badge`, `DataTable`.
- Produces: `PlayerProfile` default export composing `ProfileStats` and `ProfileTeams`.

- [ ] **Step 1: Move the files**

```bash
cd Client/src && mkdir -p features/tournaments features/profile
for f in Tours TournamentDetails RegisterTour TournamentHostingForm TicketBookingForm; do
  git mv components/$f.jsx features/tournaments/$f.tsx
done
git mv components/PlayerProfile.jsx features/profile/PlayerProfile.tsx
git mv components/PlayerRegistrationForm.jsx features/profile/PlayerRegistrationForm.tsx
```

- [ ] **Step 2: Remove the hardcoded backend URL in `Tours.tsx`**

`Tours.jsx` hardcodes a backend URL instead of using centralised constants. Replace the raw `axios` call with the `api` client, which already carries the base URL.

- [ ] **Step 3: Split `PlayerProfile.tsx` (333 lines)**

Extract the stats block into `ProfileStats.tsx` and the team list into `ProfileTeams.tsx`, each with explicit props. `PlayerProfile.tsx` keeps data fetching and view/edit mode, composing the two.

- [ ] **Step 4: Convert the tournament components**

Add prop types, apply the class mapping, switch to `api`. `TournamentHostingForm` is the screen the P2 organizer co-pilot will later target — leave a comment marking that, but add no AI code.

- [ ] **Step 5: Update the router, verify, commit**

```bash
cd Client && npx tsc --noEmit && npx eslint src/features && npx vitest run && npx vite build
git add -A Client/src
git commit -m "refactor(client): move tournaments and profile into feature modules

Splits the 333-line PlayerProfile into ProfileStats + ProfileTeams and
removes the hardcoded backend URL from the tournament list."
```

---

### Task 13: `features/analytics/`, `features/scoring/`, and the remaining primitives

Finishes the migration. After this task **no `.jsx` files remain**.

**Files:**
- Move: `components/{OwnerAnalytics,OrganizerAnalytics}.jsx` → `features/analytics/*.tsx`
- Move: `components/CricketScoreboard.jsx` → `features/scoring/CricketScoreboard.tsx`
- Move: `components/{Layout,Navbar}.jsx` → `app/Layout.tsx`, `components/Navbar.tsx`
- Convert: `components/ui/{avatar,popover,select,tabs,toast,toaster}.jsx` → `.tsx`
- Convert: `components/ProductShell.jsx` → delete (replaced by primitives)
- Convert: `hooks/use-toast.js` → `hooks/use-toast.ts`
- Convert: `lib/utils.js` → `lib/utils.ts`; `utils/constants.js` → `utils/constants.ts`

**Interfaces:**
- Consumes: `DataTable`, `Card`, `Badge`.
- Produces: `OwnerAnalytics`, `OrganizerAnalytics`, `CricketScoreboard` default exports; `Layout` with `<Outlet />`.

- [ ] **Step 1: Rebuild the analytics screens on `DataTable`**

Replace the `MetricCard` grids. Owner analytics becomes a totals row plus a per-ground table:

```tsx
const groundColumns: Column<GroundRow>[] = [
    { key: "name", header: "Ground", render: (g) => g.name },
    { key: "bookings", header: "Bookings", align: "right", numeric: true, render: (g) => g.bookings },
    {
        key: "revenue",
        header: "Revenue",
        align: "right",
        numeric: true,
        render: (g) => `₹${g.revenue.toLocaleString("en-IN")}`,
    },
];
```

Revenue is now correct because of Task 7.

- [ ] **Step 2: Move scoring, layout, and navbar**

```bash
cd Client/src && mkdir -p features/analytics features/scoring
git mv components/OwnerAnalytics.jsx features/analytics/OwnerAnalytics.tsx
git mv components/OrganizerAnalytics.jsx features/analytics/OrganizerAnalytics.tsx
git mv components/CricketScoreboard.jsx features/scoring/CricketScoreboard.tsx
git mv components/Layout.jsx app/Layout.tsx
git mv components/Navbar.jsx components/Navbar.tsx
```

When converting `Layout.tsx`, **keep its `useLocation` + `window.scrollTo(0, 0)` effect**. Task 14 rewrites this file to add the skip link and `<main>` landmark and keeps the effect too; losing it in either task is a silent navigation regression. Drop only the `bg-black` from its wrapper — the page background comes from `--ground` now.

Fix the `useEffect` missing-dependency warning in `CricketScoreboard` by wrapping `saveToLocalStorage` in `useCallback`.

- [ ] **Step 3a: Delete the dead shadcn toast system**

`main.tsx` renders `sonner`'s `Toaster`. Nothing imports `@/components/ui/toast`, `@/components/ui/toaster`, or `use-toast` — verify, then delete:

```bash
cd Client && grep -rn "use-toast\|ui/toast\|ui/toaster" src/ --include=*.tsx --include=*.ts --include=*.jsx --include=*.js | grep -v "src/components/ui/toast\|src/hooks/use-toast"
```

Expected: **no output.** Then:

```bash
cd Client/src && git rm components/ui/toast.jsx components/ui/toaster.jsx hooks/use-toast.js
```

This removes ~200 lines of dead code carrying 8 of the remaining lint errors (7 `react/prop-types` in `toast.jsx`, 1 `no-unused-vars` for `actionTypes` in `use-toast.js`). If the grep **does** return a hit, stop and report — do not delete a live dependency.

- [ ] **Step 3b: Convert the live Radix primitives**

Convert `avatar`, `popover`, `select`, `tabs` to `.tsx` using `React.ComponentPropsWithoutRef<typeof X.Root>` typing, and rewire their colours from the shadcn utilities to Maidan tokens (`bg-popover` → `bg-surface`, `text-popover-foreground` → `text-ink`, `border-input` → `border-rule`, `text-muted-foreground` → `text-ink-soft`, `bg-accent` → `bg-surface-sunk`). Delete each `.jsx`.

`avatar.tsx` legitimately needs `rounded-full` — a circular avatar is intentional. Keep it; Task 15 adds the one sanctioned lint exemption for it.

- [ ] **Step 4: Migrate `App.tsx`, then delete `ProductShell.jsx`**

`App.tsx` is the logged-in home dashboard and is the **last** consumer of `ProductShell`, `MetricCard`, and `SectionBlock` — Tasks 9–12 did not touch it. Migrate it first:

- Replace `<ProductShell kicker title description actions>` with a plain header block: `<div className="mx-auto max-w-7xl space-y-6 px-4 pb-16 pt-28 md:px-8">` wrapping an `<h1 className="font-display text-4xl uppercase leading-none tracking-wide md:text-5xl">`.
- Replace each `<MetricCard label value detail />` with a `<Card>` containing a `text-xs uppercase tracking-widest text-ink-soft` label, a `font-data text-3xl tabular-nums` value, and a `text-sm text-ink-soft` detail.
- Replace each `<SectionBlock kicker title description>` with `<section className="rounded border border-rule bg-surface p-6 md:p-8">` plus the same kicker/title/copy classes.
- Replace `cta-primary` / `cta-secondary` with `<Button asChild><Link …></Button>` and `variant="outline"`.
- Replace `text-[#d8b56d]` with `text-pending` and `border-white/10` / `bg-white/5` with `border-rule-soft` / `bg-surface-sunk`.

Then remove the shell:

```bash
cd Client/src && git rm components/ProductShell.jsx
```

Confirm nothing still imports it:

```bash
cd Client && grep -rn "ProductShell\|MetricCard\|SectionBlock\|RoleDashboard" src/ || echo "NO SHELL REFERENCES"
```

Expected: `NO SHELL REFERENCES`.

- [ ] **Step 5: Convert the remaining JS modules**

```bash
cd Client/src && git mv lib/utils.js lib/utils.ts && git mv utils/constants.js utils/constants.ts
```

Add types to `cn`. (`hooks/use-toast.js` is not here — Step 3a deleted it as dead code.)

- [ ] **Step 5b: Remove the deprecated global axios default**

Task 8 kept `axios.defaults.withCredentials = true` in `app/providers.tsx` because fourteen components still used raw `axios`. They have all migrated now. Prove it, then delete the line and its comment:

```bash
cd Client && grep -rn "from ['\"]axios['\"]" src/ || echo "NO RAW AXIOS CALLERS"
```

Expected: only `src/lib/api.ts` (which legitimately imports axios to build the client) and `app/providers.tsx` itself. **If any component still appears, stop** — migrate it before deleting the global, or its authenticated requests start returning 401 at runtime with no build error.

- [ ] **Step 6: Assert the migration is complete**

```bash
cd Client && find src -name "*.jsx" -o -name "*.js" | grep -v node_modules
```

Expected: **no output.**

- [ ] **Step 7: Verify and commit**

```bash
cd Client && npx tsc --noEmit && npx eslint . && npx vitest run && npx vite build
git add -A Client/src
git commit -m "refactor(client): complete TS migration; rebuild analytics on DataTable

No .jsx or .js files remain under src/. Analytics screens replace
unscannable MetricCard grids with column-locked tables showing the
now-correct revenue figures from the Task 7 fix."
```

---

### Task 14: Accessibility and performance floor

**Files:**
- Modify: `Client/src/app/Layout.tsx`
- Modify: `Client/src/index.css`
- Modify: `Client/vite.config.js`
- Create: `Client/src/app/Layout.test.tsx`

**Interfaces:**
- Consumes: Layout from Task 13.
- Produces: a skip link as the first focusable element; `<main id="main-content">`; manual chunk splitting.

- [ ] **Step 1: Write the failing test**

Create `Client/src/app/Layout.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Layout from "./Layout";

describe("Layout", () => {
    it("renders a skip link targeting the main region", () => {
        render(
            <MemoryRouter>
                <Layout />
            </MemoryRouter>,
        );
        const skip = screen.getByRole("link", { name: /skip to main content/i });
        expect(skip).toHaveAttribute("href", "#main-content");
    });

    it("renders a main landmark with the matching id", () => {
        render(
            <MemoryRouter>
                <Layout />
            </MemoryRouter>,
        );
        expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
    });
});
```

- [ ] **Step 2: Run it — expect FAIL**

```bash
cd Client && npx vitest run src/app/Layout.test.tsx
```

Expected: FAIL — no skip link exists.

- [ ] **Step 3: Add the skip link and main landmark**

In `Client/src/app/Layout.tsx`:

```tsx
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../features/marketing/Footer";

export default function Layout() {
    const location = useLocation();

    // Preserved from the original Layout: reset scroll position on navigation.
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return (
        <div className="flex min-h-screen flex-col">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:border focus:border-rule focus:bg-surface focus:px-4 focus:py-2 focus:text-ink"
            >
                Skip to main content
            </a>
            <Navbar />
            <main id="main-content" className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
```

Two things carried over deliberately from the original `Layout.jsx`:

- **The scroll-to-top effect.** The original reset `window.scrollTo(0, 0)` on every location change. Dropping it is a silent UX regression — navigating from a scrolled list to a detail page would land mid-page.
- **The flex column wrapper.** The original used `bg-black h-fit flex flex-col justify-between` to keep the footer down the page. The `bg-black` goes (the page background now comes from `--ground`), but the column layout is replaced with `flex min-h-screen flex-col` plus `flex-1` on `<main>`, which pins the footer to the bottom on short pages instead of leaving it floating mid-viewport.

- [ ] **Step 4: Run the test — expect PASS**

```bash
cd Client && npx vitest run src/app/Layout.test.tsx
```

Expected: `2 passed`.

- [ ] **Step 5: Split vendor chunks**

The build warns that one chunk exceeds 500 kB. In `Client/vite.config.js`, add to `build`:

```js
build: {
    rollupOptions: {
        output: {
            manualChunks: {
                "react-vendor": ["react", "react-dom", "react-router-dom"],
                "state-vendor": ["@reduxjs/toolkit", "react-redux", "redux-persist", "@tanstack/react-query"],
                "stripe-vendor": ["@stripe/stripe-js", "@stripe/react-stripe-js"],
                "motion-vendor": ["framer-motion", "gsap"],
            },
        },
    },
    chunkSizeWarningLimit: 500,
},
```

- [ ] **Step 6: Convert large raster assets to webp**

```bash
cd Client/src/assets && for f in *.jpg *.png; do npx -y sharp-cli -i "$f" -o "${f%.*}.webp" -f webp -q 82 2>/dev/null || true; done
```

Then update **both** reference sites, not just one:

1. Every `import x from "../assets/*.png"` in `src/`.
2. **`tailwind.config.js` `backgroundImage`** — nine entries point at `url("/src/assets/*.png|jpg")`. These are plain strings, so TypeScript will not catch a stale path; a missed one silently renders no background.

Verify before deleting the originals:

```bash
cd Client && grep -rn "assets/.*\.\(png\|jpg\|jpeg\)" src/ tailwind.config.js || echo "ALL MIGRATED"
```

Delete the originals **only** once that prints `ALL MIGRATED` and `npx vite build` passes. If `sharp-cli` is unavailable, skip this step entirely and note it — it is an optimisation, not a correctness fix, and a half-migrated asset set is worse than none.

- [ ] **Step 7: Verify and commit**

```bash
cd Client && npx tsc --noEmit && npx vitest run && npx vite build 2>&1 | tail -12
```

Expected: no chunk exceeds 500 kB.

```bash
git add -A Client
git commit -m "feat(a11y,perf): skip link, main landmark, vendor chunk splitting

Adds the accessibility floor (skip link, main landmark; focus-visible and
prefers-reduced-motion landed in Task 3) and splits vendor bundles so no
chunk exceeds 500 kB."
```

---

### Task 15: Lint to zero, enforce the token rule, final verification

**Files:**
- Modify: `Client/eslint.config.js`
- Modify: `.github/workflows/ci.yml` (remove any `|| true` added in Task 1)
- Modify: `docs/PLAN.md` (tick off P0a)

**Interfaces:**
- Consumes: everything prior.
- Produces: a lint rule that fails the build on raw colour literals outside `src/design/`.

- [ ] **Step 0: Demolish the deprecated legacy block (deferred from Task 3)**

Task 3 kept the shadcn `:root` block and the `.product-*` / `cta-*` utility classes alive so the app stayed styled while Tasks 4 and 9-13 migrated their 24 consumers. Those consumers are now gone. Prove it, then delete.

First, prove zero consumers remain:

```bash
cd Client && grep -rnE "product-(page|shell|panel|hero|card|grid)|section-(kicker|title|copy)|display-title|stat-(card|value)|muted-copy|pill-(accent|gold)|standard-(input|select|textarea)|cta-(primary|secondary)|surface-divider|font-cabinet" src/ || echo "NO LEGACY CLASS CONSUMERS"
cd Client && grep -rnE "bg-(background|card|popover|primary|secondary|muted|accent|destructive)|text-(foreground|card-foreground|popover-foreground|primary-foreground|secondary-foreground|muted-foreground|accent-foreground|destructive-foreground)|border-(border|input)|ring-ring" src/ || echo "NO SHADCN UTILITY CONSUMERS"
```

Both must print their `NO …` line. **If either returns hits, stop** — a consumer was missed in Tasks 9-13. Report which file, migrate it, then resume. Do not delete CSS that something still uses.

Once both are clean, delete from `Client/src/index.css` everything below the `DEPRECATED` marker comment Task 3 added — the `@layer base { :root { --background … } }` shadcn block, the `.dark` block, the `--arena-*` variables, and every `.product-*` / `.section-*` / `.display-title` / `.stat-*` / `.muted-copy` / `.pill-*` / `.standard-*` / `.cta-*` / `.surface-divider` rule — including the marker itself.

Then clean `tailwind.config.js` of everything Task 3 marked DEPRECATED:

- Delete the shadcn colour mappings from `theme.extend.colors`: `background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, `chart`. Keep the Maidan tokens (`ground`, `surface`, `ink`, `go`, `urgent`, `pending`, `rule`).
- Delete the two deprecated `fontFamily` aliases `cabinet-black` and `cabinet-extrabold` — they existed only because the legacy `.display-title` / `.section-title` rules `@apply` them, and those rules are gone now.
- **Check `tailwindcss-animate` before removing it.** Task 13 converted `popover`/`select`/`tabs` to `.tsx`; if the converted versions still use `animate-in` / `fade-*` / `zoom-*` / `slide-in-*`, the plugin is a live dependency and **stays**:

```bash
cd Client && grep -rnE "animate-in|animate-out|fade-(in|out)|zoom-(in|out)|slide-in-|slide-out-" src/ || echo "ANIMATE PLUGIN UNUSED — safe to remove"
```

Remove the plugin and the dependency only if that prints the `UNUSED` line.

Verify the file shrank to the Maidan-only form and the build still passes:

```bash
cd Client && npx vite build && grep -c "arena-\|product-card\|cta-primary" src/index.css
```

Expected: build succeeds, grep prints `0`.

- [ ] **Step 1: Add the no-raw-colour rule**

Append to `Client/eslint.config.js`, before the closing `]`:

```js
  // Layer 3 never writes a colour. docs/PLAN.md §6.
  {
    files: ['src/features/**/*.{ts,tsx}', 'src/components/**/*.{ts,tsx}', 'src/app/**/*.{ts,tsx}'],
    // src/features/marketing is exempt until P1. Those 11 components carry 45
    // raw hex literals and the legacy gold* palette; restyling a landing page
    // is design work, not mechanical migration, and P0a's remit is "nothing new
    // ships, existing things become correct". Remove this exemption as part of
    // the P1 marketing redesign - see docs/PLAN.md section 4.
    ignores: ['src/design/**', 'src/features/marketing/**'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "Literal[value=/#[0-9a-fA-F]{3,8}\\b/]",
          message:
            'Raw colour literal. Use a design token (bg-ground, text-ink, text-go, …). See docs/PLAN.md §5.',
        },
        {
          selector: "Literal[value=/\\b(bg|text|border)-white\\/[0-9]+/]",
          message:
            'Translucent white overlay is banned. Use bg-surface-sunk or border-rule-soft. See docs/PLAN.md §5.',
        },
        {
          selector: "Literal[value=/\\brounded-(2xl|3xl|full)\\b/]",
          message: 'Radius above 3px is banned — chalk lines are straight. See docs/PLAN.md §5.',
        },
      ],
    },
  },
```

- [ ] **Step 2: Run lint and fix every remaining error**

```bash
cd Client && npx eslint . 2>&1 | tail -40
```

Work the list to zero. Expected categories: leftover unused imports, any `rounded-full` on avatars (allowed only inside `src/components/ui/avatar.tsx` — add a targeted `// eslint-disable-next-line no-restricted-syntax` with a comment explaining that a circular avatar is intentional).

- [ ] **Step 3: Confirm zero**

```bash
cd Client && npx eslint . && echo "LINT CLEAN"
```

Expected: `LINT CLEAN`.

- [ ] **Step 4: Confirm the class inventory is empty**

```bash
cd Client && grep -rnoE "product-(page|shell|panel|hero|card|grid[0-9-]*)|section-(kicker|title|copy)|display-title|stat-(card|value)|muted-copy|pill-(accent|gold)|standard-(input|select|textarea)|cta-(primary|secondary)|surface-divider|font-cabinet[a-z-]*" src/ || echo "NO DEAD CLASSES"
```

Expected: `NO DEAD CLASSES`.

- [ ] **Step 5: Run the full P0a verification matrix**

```bash
cd e:/MERN/CricArena/Client
echo "— fonts —"      && npx vite build 2>&1 | grep -c woff2
echo "— no hex —"     && (grep -rEl "#[0-9a-fA-F]{6}" src/features src/components 2>/dev/null | grep -v "src/features/marketing/" || echo clean)
echo "— no jsx —"     && (find src -name "*.jsx" -o -name "*.js" | grep -v node_modules || echo clean)
echo "— typecheck —"  && npx tsc --noEmit && echo ok
echo "— lint —"       && npx eslint . && echo ok
echo "— tests —"      && npx vitest run
echo "— build —"      && npx vite build 2>&1 | tail -3
cd ../Server
echo "— server tc —"  && npx tsc --noEmit && echo ok
echo "— server test —" && npx vitest run
```

Every line must report success. Against [docs/PLAN.md §11](../../PLAN.md):

| Claim | Check |
|---|---|
| Fonts load | woff2 count > 0 |
| One token system | no hex outside `design/` (plus the `features/marketing/` P1 exemption) |
| `Web/` gone | already untracked via `.gitignore` |
| TS migration done | no `.jsx`/`.js` under `src/` |
| Lint clean | `eslint .` exit 0 |
| Revenue correct | `analytics.service.test.ts` passes |
| A11y floor | `Layout.test.tsx` passes; focus-visible + reduced-motion in `index.css` |
| Bundle sane | no chunk > 500 kB |
| CI green | workflow passes |

- [ ] **Step 5b: Add a UTF-8 source guard to CI**

Two separate subagent edits during this plan wrote cp1252 bytes (a `0x97` em dash) into otherwise-UTF-8 source files. Both were caught by review, but only by luck — an invalid byte in a comment breaks no build and no test. Make it mechanical.

Add this step to the `client` job in `.github/workflows/ci.yml`, before `npm run typecheck`:

```yaml
      - name: Check source files are valid UTF-8
        working-directory: .
        shell: bash
        run: |
          python3 - <<'PY'
          import os, sys
          bad = []
          for root, dirs, files in os.walk('.'):
              dirs[:] = [d for d in dirs if d not in
                         ('node_modules', '.git', 'dist', '.next', '.superpowers', 'coverage')]
              for f in files:
                  if not f.endswith(('.ts', '.tsx', '.js', '.jsx', '.css', '.json',
                                     '.md', '.yml', '.prisma', '.html')):
                      continue
                  p = os.path.join(root, f)
                  try:
                      open(p, 'rb').read().decode('utf-8')
                  except UnicodeDecodeError as e:
                      bad.append(f"{p}: byte {hex(e.object[e.start])} at offset {e.start}")
          if bad:
              print("Invalid UTF-8 in source files:")
              for b in bad:
                  print("  " + b)
              sys.exit(1)
          print("All source files are valid UTF-8")
          PY
```

Confirm it passes locally first by running the same scan; it must report zero files.

- [ ] **Step 6: Re-enable the lint gate in CI**

If Task 1 Step 16 added `|| true` to the lint step, remove it now.

- [ ] **Step 7: Tick off P0a in the plan document**

In `docs/PLAN.md` §4, mark the P0a bullets complete and note the completion date.

- [ ] **Step 8: Commit and push**

```bash
git add -A
git commit -m "chore(lint): zero errors; enforce design tokens via lint

Adds no-restricted-syntax rules banning raw hex, translucent white
overlays, and radius above 3px outside src/design/ — the mechanism that
keeps the single token system true over time.

P0a complete: fonts load, one token system, full TypeScript, zero lint
errors, a11y floor, test + CI floor, owner revenue correct."
git push
```

---

## Self-Review

**Spec coverage** — [docs/PLAN.md §4 P0a](../../PLAN.md) checked item by item:

| P0a requirement | Task |
|---|---|
| Delete `Web/`, `cookie.txt`, purge `.mov`/`.zip` | ✅ done pre-plan (commit `06aadaf`) |
| Convert images to webp | Task 14 Step 6 |
| Real font system, absolute paths, existence check | Task 2 (via `@fontsource`, which makes it a build error) |
| Single token layer; delete shadcn HSL block | Task 3 |
| `CreaseCard` and `DataTable` | Tasks 5, 6 |
| Unify logged-out/logged-in identity | Tasks 3 + 9 |
| Feature-module restructure; split the four big files | Tasks 9–13 (`Discover` T10, `PlayerProfile` T12, `Grouds` T11, `CricketScoreboard` T13) |
| Finish TS migration; remove global `axios.defaults` | Tasks 9–13; `axios.defaults` in Task 8 |
| `auth:unauthorized` real body | Task 8 |
| ESLint to zero + hex ban | Task 15 |
| A11y + performance floor | Tasks 3 (focus/reduced-motion) + 14 |
| Booking consolidation + revenue fix | Task 7 |
| Testing + CI from zero | Task 1 |

No gaps. One addition beyond the spec: Task 1 extends ESLint to `.ts`/`.tsx`, which the spec did not anticipate — without it, finishing the TS migration would have silently reduced lint coverage to near zero.

**Placeholder scan** — no `TBD`/`TODO`/"similar to Task N". Three steps intentionally direct the implementer to read the server for the real contract (Task 10 Steps 1–2, Task 8 Step 6) rather than guessing field or action names; each names the exact file to open.

**Type consistency** — `creaseFill(current, required)` is used identically in Tasks 5 and 10. `Column<T>`/`DataTable` signatures match across Tasks 6, 10, and 13. `computeGroundRevenue` returns `{ bookings, revenue }` in Task 7 and is consumed with those names in Task 13. `onUnauthorized` returns an unsubscribe function in Task 8 and is used that way in `providers.tsx`.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-10-08-p0a-frontend-foundation.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?

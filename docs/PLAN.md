# CricArena — Build Plan

**Status:** Planning complete through P0a design. Awaiting two open decisions (§9).
**Last updated:** 2026-10-08
**Supersedes:** parts of [product-audit-and-roadmap.md](product-audit-and-roadmap.md) — that document's strategy and monetization sections still stand; its frontend/backend gap analysis is superseded by §3 below, and its "Recommended Folder Structure" is superseded by §6.

---

## 1. What CricArena is

The **coordination layer** for local cricket.

Local cricket in India runs on WhatsApp groups and spreadsheets. A player who wants a game on Saturday can't find one outside their existing circle. A captain with 7 of 11 spends two days chasing four more. A ground owner has empty 6pm slots and no way to reach nearby groups that want them. An organizer runs a 16-team tournament through screenshots of UPI payments.

CricArena turns *"I want to play"* into **an actual eleven, on an actual pitch, at an actual time** — then books and pays for the ground in the same flow.

### Positioning

| Competitor | Owns | Funding |
|---|---|---|
| CricHeroes | Scoring, stats, player identity. Shipped AI highlights, AI commentary, AI news feed, AI match insights, PRO tier (2026) | Established |
| Playo | Venue booking, 1,000+ venues / 15+ cities. Has dynamic pricing | $2.62M |
| Hudle | Venue booking, 2,000+ venues. Shipped Hudle Vision (AI match recording + analysis, Aug 2026) | $5.85M |
| KheloMore | Venue booking, 250+ cities | Seed |

**The gap:** three funded players own venue supply; CricHeroes owns scoring and identity. **Nobody owns coordination** — squad formation, availability matching, and getting a game to actually happen.

**Why it compounds:** CricArena holds *both sides* of a local market in one database — unfilled squads and empty slots. Demand-to-supply matching is possible here and structurally impossible for a booking-only or scoring-only app.

**Explicitly not competing on:** AI highlights and AI video analysis. Two funded incumbents already shipped it, it requires cameras at venues, and it is the most capital-intensive thing available.

---

## 2. Decisions made (and why)

| Decision | Choice | Rationale |
|---|---|---|
| **Frontend stack** | Keep `Client/` (Vite + React Router). **Delete `Web/`.** | `Web/` is a Next.js fork with four dependencies and 100% mock data — closer to "18 layout sketches" than an app. Migrating would cost `"use client"` boundary work, a `redux-persist` hydration gate, a Stripe client island, and a full router rewrite — all before any redesign or AI work ships. Vite keeps Redux, redux-persist, Stripe Elements, TanStack Query, and cookie auth working as-is. |
| **SEO / SSR** | Deferred. Not in scope. | Only a handful of pages need indexing (`/grounds/:slug`, `/tournaments/:slug`, landing). Solvable later as a small separate surface without touching the authenticated product. |
| **Design scope** | Full cricket-native redesign — **direction "Maidan"** (§5) | The current look is generic dark-SaaS with zero cricket in it, and is close to unreadable in the sunlight where users actually open the app. Maidan is differentiated from all four competitors, honest to maidan/gully cricket, and light-first for outdoor readability. |
| **Data screens** | Tabular, column-locked discipline | Replaces the unscannable four-across `MetricCard` grids in the analytics screens. |
| **GenAI scope** | All four Tier-1/2 features (§8) | NL discovery, squad-fit matching, organizer co-pilot, match narratives. |
| **Capacity** | Solo, full-time | Plan is sequenced as independently shippable phases, aggressive YAGNI off the critical path. |

### Reversed during planning

An earlier decision to migrate to Next.js was **reversed**. The reasoning that flipped it: redesigning a component in place means editing JSX and classes; porting it to App Router *additionally* means resolving server/client boundaries, gating `redux-persist` against SSR hydration mismatches, isolating Stripe Elements as a client island, and rewriting the router. That work is *on top of* the redesign, not absorbed by it — a tax paid now for SEO not yet needed.

---

## 3. Verified gaps

Every item below was confirmed against the code, not inferred.

### Frontend — critical

1. **The typography system is dead.** [index.css](../Client/src/index.css) declares nine `@font-face` blocks for `CabinetGrotesk-*` at `../fonts/`. That directory **does not exist anywhere in the repo** (`*.woff*` and `*CabinetGrotesk*` both return zero matches). Every `font-cabinet-*` utility in [tailwind.config.js](../Client/tailwind.config.js) resolves to a missing family. `.display-title`, `.section-title`, and `.stat-value` all render in system sans today.

2. **Three of four Google Fonts imports 404.** `Product+Sans`, `Product+Sans+Black`, `Product+Sans+Medium` are imported from Google Fonts. Product Sans is Google's proprietary brand typeface and is not hosted there. Plus a duplicate `Audiowide` `@import` inside a `<style>` tag in [index.html](../Client/index.html).

3. **Two competing frontends.** `Client/` (Vite, 18 routes, real API) vs `Web/` (Next.js 15, 18 routes, `mock-data.ts`). `Web/` duplicates `ProductShell`/`RoleDashboard` and makes zero API calls.

4. **Two visual identities in one app.** [App.tsx](../Client/src/App.tsx) renders `<Landing />` when logged out — `bg-black`, image backdrops, GSAP. Logged in, the same route renders `ProductShell` — gold on near-black, `rounded-[28px]` panels. Crossing login looks like changing products.

5. **The design system is the generic AI default.** Near-black + single metallic accent + `rounded-3xl` gradient cards + uppercase tracked eyebrows + gradient pill CTAs. Zero cricket-specific visual vocabulary, despite cricket having an unusually rich one (wagon wheels, pitch maps, Manhattan charts, over-by-over worms, scorecard typography, the dot-ball grid).

6. **Two token systems, neither authoritative.** shadcn HSL vars in `:root`/`.dark` drive `components/ui/*`; `--arena-*` hex vars drive the hand-rolled `.product-card`/`.cta-primary` classes used by real screens. `.dark` is never applied, so the primitives render light-on-light inside a dark shell.

7. **TypeScript migration ~15% done.** TS: `App.tsx`, `main.tsx`, `Login.tsx`, `Landing.tsx`, `ErrorBoundary.tsx`, `redux/*`, `lib/api.ts`. Still JSX: 31 components, including every large one — `Discover` (478 lines), `CricketScoreboard` (476), `PlayerProfile` (333), `Grouds` (298). [main.tsx](../Client/src/main.tsx) still sets global `axios.defaults.withCredentials` with a comment admitting legacy JSX depends on it.

8. **83 ESLint errors, 4 warnings.** prop-types across every `ui/*` primitive and all of `ProductShell`; unused `React` imports; missing hook deps in `CricketScoreboard` and `RegisterTour`. (`tsc --noEmit` passes on both packages.)

9. **No accessibility or performance floor.** No `focus-visible` styling, no `prefers-reduced-motion`, no skip link. `assets/` ships a `.mov`, a `.zip`, and 12 uncompressed jpg/png.

10. **`auth:unauthorized` is a no-op.** [main.tsx](../Client/src/main.tsx) dispatches the event into a handler containing only a comment, so 401s do nothing.

### Backend

11. **Discovery cannot scale.** [discovery.service.ts](../Server/src/modules/discovery/discovery.service.ts) fetches **every** `OPEN` PlayRoom and **every** active `PlayerAvailability`, then Haversine-filters in JavaScript. No bounding-box predicate, no lat/long index, no pagination. This is the product's wedge feature running at O(all rows) per request.

12. **No `ORGANIZER` role.** The enum is `PLAYER | OWNER | ADMIN`, yet `/organizer/analytics` is gated behind `requireRole(OWNER, ADMIN)` in [register-routes.ts](../Server/src/app/register-routes.ts). Organizers are modelled as owners.

13. **Owner revenue is wrong today.** [analytics.service.ts](../Server/src/modules/analytics/analytics.service.ts) counts bookings from `ground.bookings + structuredBookings.length` but sums revenue only from `bookingRecords`. **Every structured `Booking` contributes ₹0 to owner revenue.**

14. **Triple-modelled bookings.** `GroundBooking` (legacy), `Booking`, and `BookingSession` coexist in [schema.prisma](../Server/prisma/schema.prisma).

15. **Schema debt.** `TournamentDetails` keeps `String` dates/fees alongside typed `DateTime`/`Int` fields; `Team` has both `members User[]` and `players PlayerProfile[]`; `OwnerProfile` has both `id` and a stray `ownerId String`.

16. **Zero tests, zero CI** in the entire repository.

17. **`cookie.txt` committed at repo root.**

18. **README overclaims Socket.IO.** The README advertises *"Real-Time Ground Booking … live updates using Socket.IO."* Socket.IO is in neither package.json. Either build it (it genuinely fits slot contention) or remove the claim.

---

## 4. Phase plan

Each phase is independently shippable. Nothing later depends on a phase being *perfect*, only on it being *done*.

```
P0a ── Frontend foundation ──┐
                             ├──> P1 ── Cricket-native screens
P0b ── Backend correctness ──┘         │
                                       └──> P2 ── GenAI Tier 1
                                                   │
                                                   └──> P3 ── GenAI Tier 2 + monetization
```

### P0a — Frontend foundation

Nothing new ships; existing things become correct and coherent.

- Delete `Web/`, delete `cookie.txt`, purge `.mov`/`.zip` from `assets/`, convert images to webp
- Real font system: self-hosted `.woff2` in `Client/public/fonts/`, **absolute `/fonts/…` paths**, build-time existence check
- Single token layer (§5); delete the shadcn HSL block; rewire `ui/*` to Maidan tokens
- Build `CreaseCard` and `DataTable` primitives
- Unify logged-out and logged-in identity onto one system
- Restructure components into feature modules (§6); split the four 300–480-line files
- Finish the TypeScript migration; remove the global `axios.defaults`
- Give `auth:unauthorized` a real body (logout, clear persisted state, redirect with return path)
- ESLint to zero, with a lint rule banning raw hex outside `design/`
- Accessibility + performance floor
- **Pulled forward from P0b:** consolidate the three booking models and fix the revenue defect (#13). You cannot redesign an analytics screen on numbers you know are wrong.
- Testing + CI from zero

### P0b — Backend correctness

- Add `ORGANIZER` to the `Role` enum; re-gate organizer routes
- Discovery: indexed SQL bounding-box pre-filter → Haversine refinement → pagination
- Normalize `TournamentDetails` date/money fields; collapse `Team.members`/`Team.players`; drop the stray `OwnerProfile.ownerId`
- Stripe webhook signature verification
- Request-level tests on ownership guards and analytics revenue
- **Decide:** build Socket.IO slot-contention, or remove the README claim

### P1 — Cricket-native screens

Apply the Maidan system screen by screen, highest-traffic first: discovery → rooms → grounds/slots → booking → profile → analytics → tournaments → marketing. Designed empty states and skeleton loaders throughout.

**The marketing surface is explicitly P1, not P0a.** P0a moves those 11 components into `features/marketing/` and converts them to TypeScript, but leaves their visuals alone: they carry a legacy `gold`/`goldx`/`orangex` palette, 45 raw hex literals, and bespoke GSAP animation. Deciding what those become on a landing page is design judgement, not a mechanical class substitution, and P0a's remit is "nothing new ships; existing things become correct". Until this phase runs, `features/marketing/**` is exempt from the no-raw-hex lint rule and the legacy colour tokens stay in `tailwind.config.js`, both marked DEPRECATED. Removing that exemption and those tokens is part of this phase's definition of done.

### P2 — GenAI Tier 1

Natural-language discovery, squad-fit matching, organizer co-pilot. See §8.

### P3 — GenAI Tier 2 + monetization

Match narratives, owner yield agent, demand-to-supply matching. Commission, owner/organizer subscription tiers, promoted listings.

---

## 5. Design system — "Maidan"

Derived from the lived texture of local Indian cricket: dust, chalk creases, worn concrete, hand-painted tournament banners. Not Lord's — the ground users actually play on.

**Light-first for a functional reason:** users open this app standing outdoors in Indian daylight, at a maidan deciding whether to join a room. The current `#0c0f11` + `#d8b56d` combination is close to unreadable in direct sun.

### Tokens

```css
/* design/tokens.css — the single source. Nothing outside design/ writes a colour. */
:root {
  /* surfaces */
  --ground:       #D9C9A8;  /* page field (dust) */
  --surface:      #FAF7F0;  /* cards, panels (chalk) */
  --surface-sunk: #CFBE9B;  /* wells, inactive */

  /* ink */
  --ink:          #2B2520;  /* primary text, rules (umber) */
  --ink-soft:     #6E665C;  /* secondary text (graphite) */
  --ink-faint:    #A79D90;  /* disabled, placeholders */

  /* semantic — each maps to a cricket meaning, not a mood */
  --go:           #3F6B47;  /* available, confirmed (turf) */
  --urgent:       #A32A1F;  /* live, closing, spots-low (leather) */
  --pending:      #B07B2A;  /* awaiting approval, payment pending */

  /* line */
  --rule:         #2B2520;        /* 1px, full strength — chalk is crisp */
  --rule-soft:    rgba(43,37,32,0.16);

  --radius:       3px;            /* chalk lines are straight */
}
```

### Type

Self-hosted `.woff2`, absolute paths, `font-display: swap`.

| Role | Face | Use |
|---|---|---|
| Display | Anton | H1–H2 **only** — the painted lettering of local flex hoardings |
| Body | Inter Tight | everything prose |
| Data | IBM Plex Mono | **all** figures, `font-variant-numeric: tabular-nums` |

### Explicitly banned

No gradients. No glows. No `rounded-3xl`. No translucent white overlays. Those four are what make the current UI read as templated. Elevation is a 1px `--rule` plus the flat tonal step from `--ground` to `--surface` — never `box-shadow: 0 24px 90px`.

### Signature — `CreaseCard`

Squad completion is encoded in how much of the card's border is drawn, straight off `PlayRoom.currentPlayers / requiredPlayers`:

```
7 of 11 players                    11 of 11 — full crease
┌─────────────────────┐            ┌─────────────────────┐
│ SATURDAY POWERPLAY  │            │ GULLY LEAGUE FINAL  │
│ South Delhi · 7.0km │            │ Noida · 4.2km       │
│ 7/11 · intermediate │            │ 11/11 · advanced    │
└──────────────        ┘           └─────────────────────┘
        ↑ border breaks                      ↑ closed
```

This is the one place boldness is spent. Everything around it stays quiet.

### `DataTable`

Column-locked, right-aligned, `--font-data`. Replaces the four-across `MetricCard` grids in the analytics screens, which currently can't be scanned or compared.

```
ROOM                  DIST    SPOTS   SKILL   WHEN
───────────────────────────────────────────────────────
Saturday Powerplay    7.0km    4/11   INT     Sat 18:00
Need 2 Finishers      9.2km    2/11   ADV     Tonight
Casual Nets          11.4km    open   MIX     Sun 07:00
```

---

## 6. Architecture

### Three layers, one rule

```
Layer 1   design/tokens.css      CSS custom properties, single source
          tailwind.config.js     reads tokens, exposes utilities
                                 ↓
Layer 2   components/ui/*        primitives, token-only, no raw hex
                                 + CreaseCard  (signature)
                                 + DataTable   (tabular system)
                                 ↓
Layer 3   features/*/            screens, composed from Layer 2 only
```

**The rule that makes it hold: Layer 3 never writes a colour.** No `text-[#d8b56d]`, no `bg-white/5` — both appear ~40 times across current components. Enforced by lint, which is how it stays true at month six.

### Target frontend structure

```
Client/src/
  app/            router, providers, store wiring
  design/         tokens.css, fonts.css, primitives
  components/ui/  primitives only (incl. CreaseCard, DataTable)
  features/
    auth/         ✓ exists
    discovery/    Discover → container + DataTable view
    rooms/        RoomsHub, join requests
    grounds/      list / detail / slot picker
    bookings/     BookingsHub, CheckoutPage, StripeCheckoutWrapper
    tournaments/  Tours, TournamentDetails, RegisterTour, HostingForm
    profile/      view / edit / stats / teams
    analytics/    OwnerAnalytics, OrganizerAnalytics
    scoring/      CricketScoreboard
    marketing/    Hero, Join, ServicesHub, Upcoming, Matchups, About
  lib/            api.ts, queryClient.ts, utils
```

### Backend (already largely in place)

Nine domain modules, each `routes → controller → service → schemas`. Zod validates at the HTTP boundary; `asyncHandler` + centralized error middleware means no try/catch in controllers; `requireAuth` / `requireRole` / `requireSelfOrAdmin` guards replace the original token-presence-only check that let any authenticated user edit any profile.

### Payments — a state machine, not a button

```
select ground → select slot
      ↓
BookingSession (DRAFT)                    server-created
      ↓
Stripe PaymentIntent attached             PAYMENT_PENDING
      ↓
webhook (signature-verified)
      ↓
Booking CONFIRMED + immutable PaymentRecord
```

`@unique` on `paymentIntentId` gives idempotency, so a replayed webhook cannot double-book. Stale sessions expire instead of orphaning a slot.

### Data flow — what does *not* change

`lib/api.ts` + TanStack Query + `authSlice`/`userSlice` all stay. Three fixes only: drop the global `axios.defaults.withCredentials`, give `auth:unauthorized` a real body, and make revenue read a single authoritative source.

---

## 7. Error handling, testing, CI

### Error handling

- Per-feature error boundaries, not just the one global `ErrorBoundary`
- **Designed empty states.** An empty discovery feed is an invitation to act — *"No rooms within 10km. Widen to 25km, or start one."* — not a shrug.
- Skeleton rows in `DataTable`, replacing the bare `"Loading…"` fallback
- Verb consistency: the button that says **Join room** produces the toast **Joined**

### Testing (currently zero)

Establish a floor, don't chase coverage.

| Target | Tool | Covers |
|---|---|---|
| Client | Vitest + React Testing Library | `CreaseCard` fill math, `DataTable` sort/format, auth 401 flow, booking-session → checkout happy path |
| Server | Vitest + Supertest | ownership guards (`requireSelfOrAdmin`), **owner-revenue correctness** — this test is the proof the defect is fixed |

### CI

`.github/workflows/ci.yml` — `typecheck → lint → test → build`, both packages, on PR. **Lint failing the build is what prevents Layer 3 from writing raw hex again.**

---

## 8. GenAI layer

Every feature uses the narrowest capability that does the job. No video, no fine-tuning, no new infrastructure beyond a Postgres extension.

### Tier 1 (P2)

| Feature | Technique | Why it wins |
|---|---|---|
| **Natural-language discovery** | Claude structured outputs, JSON Schema — free text → validated `DiscoveryFilters` | Replaces a filter UI not yet built. The model returns a valid filter object or nothing; malformed queries are structurally impossible. *"medium-level 10-over game Saturday within 8km, need a bowler"* |
| **Squad-fit matching** | pgvector embeddings over `PlayerProfile` + Claude rationales | Rooms stop saying "4 spots left" and start saying *"needs a death bowler and a keeper — Rohit and Anand fit, both 3km away."* Strongest retention loop; hardest for competitors to copy. |
| **Organizer co-pilot** | Claude tool-use against existing tournament APIs | One sentence → full draft: dates, fee, capacity, deadline, fixtures, announcement copy. Replaces a 231-line blank form and targets the persona that actually pays. |

### Tier 2 (P3)

| Feature | Technique |
|---|---|
| **Match narratives** | Ball-by-ball scorecard → match report + player-of-the-match writeup. Shareable growth artifact, zero video infrastructure. |
| **Owner yield agent** | Per-slot price proposals with stated rationale over `GroundSlot` + `Booking` + `AnalyticsEvent`; owner approves/rejects, and approvals become the training signal. |
| **Demand-to-supply matching** | Reads unfilled rooms *and* empty slots — *"3 rooms within 5km want Saturday 6pm; Greenfield is empty; offer a 15% block."* Only possible because both sides live in one database. |

### Not building

AI highlights, AI video analysis. Owned by CricHeroes and Hudle, requires venue cameras, most capital-intensive option available.

---

## 9. Open decisions

Both block finalizing the P0a implementation plan.

1. **Split P0b out, or one combined spec?** They touch disjoint files and share no interface except the API contract, which doesn't change — so splitting is clean. But you're solo and sequencing them yourself anyway.
2. **Full feature-folder restructure now, or only extract the four big files?** Moving all 31 components touches every import. It's cheapest to do while rewriting them for the redesign — but it is the single largest mechanical change in P0a.

---

## 10. Tech stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript (strict), Vite 5 |
| Routing | React Router 6 — `createBrowserRouter`, lazy routes, code splitting |
| State | Redux Toolkit + redux-persist (session), TanStack Query v5 (server state) |
| Styling | Tailwind CSS 3, CSS custom-property token layer, bespoke design system |
| UI primitives | Radix UI — Dialog, Select, Tabs, Popover, Toast, Avatar, Label |
| Forms | react-hook-form + Zod resolvers |
| Motion | Framer Motion, GSAP |
| Feedback | Sonner |
| Payments (client) | `@stripe/stripe-js`, `@stripe/react-stripe-js` (Elements) |
| **Backend** | Node.js, Express 4, TypeScript |
| ORM / DB | Prisma 6, PostgreSQL |
| Vectors | pgvector |
| Validation | Zod 4 |
| Auth | JWT (`jsonwebtoken`), bcryptjs, httpOnly cookies |
| Security | Helmet, CORS, `express-rate-limit`, cookie-parser |
| Payments (server) | Stripe SDK + webhook signature verification |
| Logging | morgan |
| **GenAI** | Claude API (`@anthropic-ai/sdk`), `claude-opus-5` |
| Techniques | Structured outputs (JSON Schema), tool use, prompt caching, embeddings + pgvector hybrid search |
| **Quality** | Vitest, React Testing Library, Supertest, ESLint, `tsc --noEmit` |
| **CI** | GitHub Actions — typecheck → lint → test → build |

---

## 11. Verification criteria

### P0a — done means all of these pass

| Claim | Check |
|---|---|
| Fonts load | DevTools Network: 3 × `200` for `/fonts/*.woff2`, zero 404s, no Google Fonts `@import` remains |
| One token system | `grep -r "#[0-9a-fA-F]\{6\}" src/features src/components` returns nothing outside `design/` |
| `Web/` gone | Directory deleted, `cookie.txt` deleted, one frontend `package.json` in the repo |
| TS migration done | `find src -name "*.jsx"` returns nothing |
| Lint clean | `npx eslint .` → 0 errors, 0 warnings (from 83 / 4) |
| Revenue correct | Server test asserts a structured `Booking` with a `SUCCEEDED` `PaymentRecord` appears in owner revenue |
| A11y floor | Visible `:focus-visible` on every interactive element; `prefers-reduced-motion` honoured; skip link present |
| Bundle sane | `.mov` / `.zip` removed from `assets/`; images webp; build warns on any chunk > 500 kB |
| CI green | `typecheck → lint → test → build` passes on PR for both packages |

### Measure before/after (do not estimate)

Benchmark these so the numbers are real rather than claimed:

- Discovery p95 latency, before and after the SQL rewrite, at a stated row count
- Client bundle size and Largest Contentful Paint, before and after
- GenAI per-request input cost, before and after prompt caching

---

## 12. Reference

- [product-audit-and-roadmap.md](product-audit-and-roadmap.md) — prior audit. Strategy, monetization, GTM, and retention-loop sections remain valid; its gap analysis and folder structure are superseded here.

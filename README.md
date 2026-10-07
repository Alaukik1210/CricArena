# 🏏 CricArena

CricArena is the **coordination layer for local cricket** — a three-sided platform connecting players, ground owners, and tournament organizers. It turns *"I want to play"* into an actual eleven, on an actual pitch, at an actual time, then books and pays for the ground in the same flow.

> **Status:** in active development, pre-launch. See [docs/PLAN.md](docs/PLAN.md) for the build plan, verified gap analysis, and roadmap.

---

## 🚀 Features

**Implemented**

- 👥 **Role-based accounts** — Player, Owner, and Admin, with JWT auth over httpOnly cookies and ownership guards on every resource
- 🧭 **Radius-based discovery** — find active players and open games within a configurable distance
- 🤝 **Play Rooms** — form a squad for a casual game, a team build, or a practice session; join requests with approval, and consent-gated contact sharing
- 🏟 **Grounds & slots** — owners list grounds with pitch type, facilities, per-slot pricing, and availability
- 💳 **Booking & payments** — a booking-session state machine (`DRAFT → PAYMENT_PENDING → CONFIRMED`) backed by Stripe PaymentIntents, with idempotent persistence
- 🏆 **Tournaments** — lifecycle-managed tournaments with team registration
- 📊 **Analytics** — separate owner, organizer, and admin dashboards over a first-class event stream
- 👤 **Profiles & teams** — player profiles with skills, roles, styles, and stats; team rosters with captain/manager

**Planned** — see [docs/PLAN.md](docs/PLAN.md)

- 🎨 Cricket-native design system ("Maidan")
- 🤖 AI layer: natural-language discovery, squad-fit matchmaking, organizer co-pilot, automated match reports
- 📈 Owner yield optimisation and demand-to-supply matching

---

## 🛠️ Tech Stack

| Area | Technology |
|---|---|
| **Frontend** | React 18 · TypeScript · Vite 5 |
| Routing / state | React Router 6 · Redux Toolkit + redux-persist · TanStack Query v5 |
| Styling / UI | Tailwind CSS 3 · Radix UI primitives · Framer Motion · GSAP |
| Forms | react-hook-form + Zod |
| **Backend** | Node.js · Express 4 · TypeScript |
| Database | PostgreSQL · Prisma 6 |
| Validation | Zod 4 |
| Auth & security | JWT · bcryptjs · Helmet · CORS · express-rate-limit |
| Payments | Stripe (PaymentIntents + Elements) |

---

## 📦 Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/cricarena.git
   cd cricarena

Frontend Setup:

-cd client
-npm install
-npm run dev

Backend Setup:

-cd server
-npm install
-npx prisma generate
-npx prisma migrate dev
-npm start


.env
-DATABASE_URL=your_postgres_url
-JWT_SECRET=your_jwt_secret

# QueueTip

QueueTip is a **family-based immigration guidance** web app built with **Next.js 16**, **TypeScript**, **Tailwind CSS v4**, **PostgreSQL**, and **Prisma**. It implements structured **Prepare / Track / Resolve / Explore** journeys, **onboarding**, **case grouping**, **mock case sync**, **interpretation and recommendation engines**, **alerts**, **subscription gating**, and an **admin/CMS** layer—while keeping a clear boundary between **official facts**, **typical patterns**, and **suggested next steps**.

## Prerequisites

- Node.js 20+ recommended
- PostgreSQL 14+ (local or hosted)

## Quick start

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   Copy `.env.example` to `.env` and set:

   - `DATABASE_URL` — PostgreSQL connection string
   - `AUTH_SECRET` — long random string (e.g. `openssl rand -base64 32`)
   - `NEXTAUTH_URL` — e.g. `http://localhost:3000`

3. **Run PostgreSQL** (pick one)

   - **Docker (easiest if you have Docker Desktop):**

     ```bash
     docker compose up -d
     ```

     Then in `.env` use port **5433** (mapped from the container):

     ```env
     DATABASE_URL="postgresql://postgres:postgres@localhost:5433/queuetip?schema=public"
     ```

   - **Your own Postgres:** create a database named `queuetip` and a user/password that match `DATABASE_URL`. The default `.env.example` assumes `postgres` / `postgres` on `localhost:5432`.

4. **Create schema and seed data**

   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open `http://localhost:3000`.

## Demo and admin accounts (after seed)

| Role  | Email               | Password    |
| ----- | ------------------- | ----------- |
| Demo  | `demo@queuetip.dev` | `Demo123456!` |
| Admin | `admin@queuetip.dev`| `Admin123!`   |

Change these immediately in any shared or production environment.

## NPM scripts

| Script        | Description                |
| ------------- | -------------------------- |
| `npm run dev` | Next.js dev (Turbopack)    |
| `npm run build` / `start` | Production build / server |
| `npm run lint` | ESLint                    |
| `npm run db:generate` | `prisma generate`     |
| `npm run db:push`     | Push schema to DB     |
| `npm run db:seed`     | Seed content + demo   |
| `npm run db:studio`   | Prisma Studio         |

## Architecture notes

- **Auth**: NextAuth.js v5 (credentials) with JWT sessions; routes under `/app` and `/admin` are protected in root `proxy.ts` (Next.js 16 proxy convention).
- **Case sync**: `syncCaseFromOfficial()` in `src/lib/services/case-status-service.ts` uses a **mock** by default. For **USCIS Torch** (sandbox), set `USCIS_CLIENT_ID`, `USCIS_CLIENT_SECRET`, and `USCIS_CASE_STATUS_MODE=live`. Implementation: `src/lib/services/uscis-case-status.ts` (OAuth client credentials + `GET /case-status/{receipt}`). Docs: [Case Status API](https://developer.uscis.gov/api/case-status), [access tokens](https://developer.uscis.gov/article/how-get-access-tokens-client-credentials). **Sandbox** uses `https://api-int.uscis.gov` (defaults in code). **Production** base URLs and keys are issued only after USCIS demo approval—set `USCIS_OAUTH_TOKEN_URL` and `USCIS_CASE_STATUS_API_BASE` when you receive them. Keep secrets in server environment variables only (Render, Netlify env, etc.); never expose the client secret to the browser. Rate limits apply (see USCIS sandbox docs).
- **Interpretation / recommendations**: Rule rows in the database (`InterpretationRule`, `RecommendationRule`) plus orchestration in `src/lib/services/`.
- **Premium**: `getPlanForUser` in `src/lib/plan.ts`; placeholder upgrade at `/api/billing/upgrade`. Set `QUEUETIP_FORCE_PREMIUM=true` in `.env` to simulate Premium locally.
- **Email**: Password reset stores tokens; in development the reset URL is logged to the server console. Wire Resend/SendGrid/etc. for production.

## Product routes

Public marketing and auth: `/`, `/pricing`, `/faq`, `/about`, `/login`, `/signup`, `/forgot-password`, `/reset-password`.

Authenticated app: `/app/dashboard`, `/app/onboarding`, `/app/prepare`, `/app/track`, `/app/resolve`, `/app/explore`, `/app/tools`, `/app/help-directory`, `/app/alerts`, `/app/settings`, `/app/billing`.

Admin/CMS: `/admin` and sub-routes for guides, issues, tools, help directory, notifications, and FAQ/content.

## Legal positioning

QueueTip is **not a law firm** and does **not** provide legal advice. All user-facing copy is designed to separate **official resources** from **educational interpretation** and to avoid promising outcomes.

## License

Private / unlicensed unless you add a license file for distribution.

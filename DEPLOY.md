# BRANIFY — Vercel Deployment Guide

## Quick Deploy

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the GitHub repo: `mahbubauzair-dotcom/branify-store`
3. Vercel auto-detects Next.js + Bun — no config needed
4. Add the environment variable (see below)
5. Click **Deploy**

## Environment Variables

Add this in Vercel → Project → Settings → Environment Variables:

| Name | Value |
|------|-------|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_FgARZ6Gjs8pI@ep-sweet-moon-aywq5p5i-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require` |

Set it for **all environments** (Production, Preview, Development).

## Admin Panel

- **URL:** `https://branify.store/adminpanel`
- **Email:** `admin@branify.store`
- **Password:** `mahbuba1213`

The admin password is embedded in `src/lib/seed.ts` and auto-seeded during
every build, so deployments always have a working admin login.

## Build Process

The `build` script automatically:
1. `prisma generate` — generates the Prisma client
2. `bun run src/lib/seed.ts` — creates/updates the admin user + categories + site settings
3. `next build` — builds the Next.js app

The seed is non-fatal — if the DB is briefly unreachable, the build still
succeeds. Run `bun run seed` manually later to ensure the admin user exists.

## Storefront

- **URL:** `https://branify.store/` (home) or `https://branify.store/` → click "Store" in navbar
- The storefront reads products + categories from the Neon PostgreSQL database
- Manage products via the admin panel at `/adminpanel`

## Database

- **Provider:** Neon PostgreSQL (serverless)
- **Schema:** Prisma (`prisma/schema.prisma`)
- **Models:** AdminUser, Category, Product, SiteSetting, NewsletterSubscriber, ContactMessage, AnalyticsEvent

## Tech Stack

- Next.js 16 (App Router, Turbopack)
- React 19 + TypeScript 5
- Tailwind CSS 4 + shadcn/ui
- Framer Motion
- Prisma 6 + PostgreSQL (Neon)
- Zustand (client router)

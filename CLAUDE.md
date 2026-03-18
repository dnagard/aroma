# Aroma — Claude Code Instructions

Aroma is a coffee journaling web app for home brewers and roasters. Users log brew sessions, track bags of coffee, record roasts, and learn about coffee origins and processing.

## Commands

```bash
npm run dev      # Start development server (Next.js with Turbopack)
npm run build    # Production build
npm run lint     # ESLint
```

## Permissions 
Claude has permission to run the following commands without asking:
- `npm run build`
- `npm run lint`

No test suite is configured.

## Stack

- **Next.js 15** with App Router, React 19, TypeScript
- **Supabase** for PostgreSQL database and auth (`@supabase/ssr` for cookie-based SSR auth)
- **shadcn/ui** (Radix, Nova preset) + **Tailwind CSS v4**
- No ORM — raw Supabase client queries only

## Project Structure

```
src/
  app/
    (public)/         # Unauthenticated routes: /, /auth/*
    (protected)/      # Authenticated routes: /dashboard, /brews, /bags, /roast, /learn, /export
    layout.tsx
    globals.css
  components/
    ui/               # shadcn/ui primitives (button, card, input, etc.)
    brew/             # Brew-specific components
    bags/             # Bag-specific components
    roast/            # Roast-specific components
    tasting/          # Flavor wheel and tasting helper
    shared/           # Shared components (nav, sidebar, empty states, etc.)
  lib/
    supabase/
      client.ts       # Browser-side Supabase client (use in Client Components)
      server.ts       # Server-side Supabase client (use in Server Components + Actions)
      middleware.ts   # Session refresh utility
    constants/
      flavor-notes.ts # SCA flavor wheel taxonomy
      origins.ts      # Coffee-growing countries and regions
      methods.ts      # Brew method enum values
    utils.ts          # shadcn utility (cn)
  types/
    index.ts          # All shared TypeScript types (Bag, BrewSession, RoastSession)
docs/
  spec/               # Feature specs — read before implementing any feature
    data-model.md
    brew-sessions.md
    bags.md
    roast-sessions.md
    tasting.md
    learn.md
    export.md
```

## Path Alias

`@/*` maps to `src/*`.

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Never hard-code these. Never commit `.env.local`.

## Database Schema

See `docs/spec/data-model.md` for the full spec. Tables:

### `bags`
- id (uuid PK), user_id (uuid FK), name (text NOT NULL)
- roaster, origin_country, origin_region (text, nullable)
- process (text) — values: washed | natural | honey | anaerobic_natural | anaerobic_washed | wet_hulled | carbonic_maceration | other
- roast_level (text) — values: light | medium_light | medium | medium_dark | dark
- roast_date (date, nullable)
- varietal (text[], nullable)
- altitude_masl (int, nullable)
- flavor_notes (text[], default '{}')
- rating (numeric(3,1), nullable) — 1.0–10.0
- notes (text, nullable)
- is_home_roast (bool, default false)
- roast_session_id (uuid FK → roast_sessions, nullable)
- created_at (timestamptz, default now())

### `brew_sessions`
- id (uuid PK), user_id (uuid FK), bag_id (uuid FK → bags NOT NULL)
- brewed_at (timestamptz, default now())
- method (text) — values: espresso | v60 | pour_over | aeropress | french_press | chemex | moka_pot | cold_brew | siphon | kalita | other
- dose_grams, out_grams, water_grams, brew_temp_c (numeric, nullable)
- brew_time_s (int, nullable)
- grind_size (text, nullable)
- flavor_notes (text[], default '{}')
- rating (numeric(3,1), nullable)
- notes (text, nullable)
- created_at (timestamptz, default now())

### `roast_sessions`
- id (uuid PK), user_id (uuid FK)
- roasted_at (timestamptz, default now())
- origin_country (text, nullable), origin_region (text, nullable)
- varietal (text[], nullable)
- process (text, nullable)
- altitude_masl (int, nullable)
- charge_weight_g, drop_weight_g, charge_temp_c, drop_temp_c (numeric, nullable)
- total_time_s, first_crack_s (int, nullable)
- roast_level (text, nullable)
- notes (text, nullable)
- is_complete (bool, default false)
- generated_bag_id (uuid FK → bags, nullable)
- created_at (timestamptz, default now())

## Coding Conventions

- **TypeScript strictly** — no `any`. All shared types live in `src/types/index.ts`.
- **Server Components by default.** Add `"use client"` only when required (interactivity, hooks, browser APIs).
- **Server Actions** for all data mutations. No API routes unless there is a strong reason.
- **Raw Supabase queries** — no ORM. Use `src/lib/supabase/server.ts` in Server Components and Actions; `src/lib/supabase/client.ts` in Client Components.
- **Zod** for all form validation and Server Action input parsing.
- **Tailwind v4** for all styling — no inline styles, no CSS modules.
- **Named exports** for all components except Next.js page and layout files (which use default exports).
- Every data-fetching route needs loading and error states.
- Enums are stored as plain text strings with Postgres check constraints, not Postgres enum types (easier to extend).
- Every migration that creates a new table must include grant select, insert, update, delete on [table] to authenticated; after the RLS policies. RLS controls row-level access but the authenticated role still needs base table privileges.

## Route Groups

- `app/(public)/` — unauthenticated: landing page, `/auth/*`
- `app/(protected)/` — authenticated: all app routes

Route protection is enforced in `app/(protected)/layout.tsx`, which redirects unauthenticated users to `/auth/login`. `middleware.ts` runs on every request to refresh the Supabase session.

## Key Business Logic

- A `RoastSession` marked `is_complete = true` automatically generates a linked `Bag` record. The bag inherits `origin_country`, `origin_region`, `varietal`, `process`, `altitude_masl` from the roast and sets `is_home_roast = true` and `roast_session_id`.
- `brew_sessions.bag_id` is NOT NULL — every brew must be linked to a bag.
- Export (MD and CSV) operates on the user's currently filtered view and is generated client-side.
- The Learn section (`/learn`) is public (no auth required) and served as static MDX content.

## What NOT To Do

- Do not introduce new dependencies without flagging them first.
- Do not use the Pages Router — App Router only.
- Do not write API route handlers for data mutations — use Server Actions.
- Do not store secrets in code — use environment variables.
- Do not build the café rating or maps feature — that is Phase 3 and out of scope.
- Do not add authentication to the `/learn` routes.

## Current Phase

**Phase 1 — Core Journaling**
- [ ] Auth (login, sign-up, forgot password, email verification)
- [ ] Supabase client setup (server + browser + middleware)
- [ ] Database migrations (bags, brew_sessions, roast_sessions + RLS policies)
- [ ] Bag management (CRUD)
- [ ] Brew session logging (CRUD)
- [ ] Roast session logging + roast→bag pipeline
- [ ] Tasting helper + flavor wheel
- [ ] Learn section (static MDX)
- [ ] Export (Markdown + CSV)
- [ ] Dashboard (stats overview)

**Phase 2 — Sync & Polish**
- Mobile-optimized UI
- Toast notifications and loading states throughout
- Add OAuth options for login
- Move auth folder from public to protected (to access logout from protected page)

**Phase 3 — Social / Discovery**
- Café rating and discovery
- Map integration



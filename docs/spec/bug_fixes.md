# Aroma — Feature Spec Sheet

**Date:** 2026-03-31
**Status:** Draft
**Features:** 3 (2 improvements, 1 future feature)

---

## Feature 1: Grind setting in brew quick-view

**Type:** UI improvement
**Priority:** Low
**File:** `src/app/(protected)/brews/page.tsx`

### Problem

The brew card quick-view shows `dose_grams / out_grams` but not `grind_size`. Grind setting is essential for reproducibility and currently requires opening the full brew detail to see.

### Current code

`brews/page.tsx:98–105` — the right-hand cell:

```tsx
<div className="relative z-10 flex shrink-0 items-center gap-6 text-sm text-muted-foreground">
  {brew.dose_grams != null && brew.out_grams != null && (
    <span>{brew.dose_grams}g / {brew.out_grams}g</span>
  )}
  {brew.rating != null && (
    <span className="font-medium text-foreground">{brew.rating}</span>
  )}
</div>
```

### Proposed change

Add `grind_size` to the quick-view row, displayed to the left of `dose_grams / out_grams`.

**Quick-view field order (left to right):**
```
bag name  |  method  ·  brewed_at  |  [grind_size  ·]  dose/out  |  rating
```

### Behavior

- If `grind_size` is `null`, omit it silently — no dash or placeholder.
- `grind_size` is a plain `text` field. Display as-is (it may be numeric like `"18"`, stepped like `"3C"`, or descriptive like `"medium-fine"`).
- If both `grind_size` and dose/out are present, show them together separated by ` · `:
  ```
  3C · 18g → 36g
  ```
- If only `grind_size` is present (no dose), show grind alone.
- If only dose/out is present (no grind), keep existing behavior unchanged.
- Dose/out display: change separator from `/` to `→` for clarity (`18g → 36g`).

### Schema / query

No schema changes needed. The page query already uses `select('*, bags(name)')`, so `grind_size` is already fetched. No query changes needed.

### Implementation

Replace the right-hand cell in `brews/page.tsx` with logic that builds the combined grind + dose string:

```tsx
const hasDose = brew.dose_grams != null || brew.out_grams != null
const hasGrind = brew.grind_size != null

const measureCell = (() => {
  const dosePart = brew.dose_grams != null && brew.out_grams != null
    ? `${brew.dose_grams}g → ${brew.out_grams}g`
    : brew.dose_grams != null
    ? `${brew.dose_grams}g`
    : null
  if (brew.grind_size && dosePart) return `${brew.grind_size} · ${dosePart}`
  if (brew.grind_size) return brew.grind_size
  return dosePart
})()
```

Then render:

```tsx
{measureCell != null && <span>{measureCell}</span>}
```

---

## Feature 2: Timezone-aware brew timestamp

**Type:** Bug fix
**Priority:** Medium
**Files:** `src/app/(protected)/brews/new/page.tsx`, `src/components/brew/NewBrewForm.tsx`, `src/app/(protected)/brews/actions.ts`

### Problem

The default `brewed_at` value is generated with `new Date().toISOString()` on the server (the page component runs server-side in Next.js App Router). `toISOString()` always returns UTC time, so users in any timezone other than UTC see an incorrect default time pre-filled in the datetime input.

```ts
// src/app/(protected)/brews/new/page.tsx:26 — always UTC
const defaultBrewedAt = new Date().toISOString().slice(0, 16)
```

A secondary problem: when the form is submitted, the `datetime-local` value is a naive local string with no timezone offset (e.g. `"2026-03-31T09:00"`). Postgres stores it as-is and interprets it against the server's session timezone (UTC by default in Supabase), so the stored value is wrong for non-UTC users.

### Fix — two-part

#### Part A: Generate the default timestamp client-side

`NewBrewForm` is already a Client Component (`'use client'`). Stop passing `defaultBrewedAt` as a prop from the server page. Instead, compute it inside the component using a local-time helper:

```ts
// Inside NewBrewForm.tsx — at the top of the component or as a module-level helper
function localDatetimeString(): string {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60_000
  return new Date(now.getTime() - offset).toISOString().slice(0, 16)
}
```

Use this as the `defaultValue` for the datetime input. Remove the `defaultBrewedAt` prop from both the page and the `Props` type.

#### Part B: Submit with UTC offset so Postgres receives a proper `timestamptz`

Add a hidden `<input name="tz_offset">` to the form that is populated client-side with the user's UTC offset in minutes:

```tsx
// In NewBrewForm — initialize once on mount
const [tzOffset] = useState(() => new Date().getTimezoneOffset())

// In the form JSX
<input type="hidden" name="tz_offset" value={tzOffset} />
```

In `createBrewAction` and `updateBrewAction`, read `tz_offset` and reconstruct a proper ISO timestamp before inserting:

```ts
// In actions.ts
const rawBrewedAt = formData.get('brewed_at') as string | null
const tzOffset = Number(formData.get('tz_offset') ?? 0) // minutes behind UTC
const brewedAt = rawBrewedAt
  ? new Date(rawBrewedAt + ':00').getTime() + tzOffset * 60_000
    // produces UTC ms; convert back to ISO
    ? new Date(new Date(rawBrewedAt + ':00').getTime() + tzOffset * 60_000).toISOString()
    : undefined
  : undefined
```

Simpler alternative — build the offset string directly in the form before submit, e.g.:

```ts
// Convert "-330" (UTC+5:30) → "+05:30", "60" (UTC-1) → "-01:00"
function isoWithOffset(localStr: string, offsetMinutes: number): string {
  const sign = offsetMinutes <= 0 ? '+' : '-'
  const abs = Math.abs(offsetMinutes)
  const hh = String(Math.floor(abs / 60)).padStart(2, '0')
  const mm = String(abs % 60).padStart(2, '0')
  return `${localStr}:00${sign}${hh}:${mm}`
}
```

Apply in a `onSubmit` handler or as a hidden field updated just before submit. This way `brewed_at` arrives at the action as a full ISO 8601 string with offset, and Postgres converts it correctly to UTC for storage.

### Summary of file changes

| File | Change |
|---|---|
| `brews/new/page.tsx` | Remove `defaultBrewedAt` local var and prop |
| `NewBrewForm.tsx` | Remove `defaultBrewedAt` from `Props`; generate locally; add `tzOffset` state + hidden field; add offset-aware submit logic |
| `brews/actions.ts` | Update `createBrewSchema` and `updateBrewSchema` to accept `tz_offset`; reconstruct offset-aware `brewed_at` before insert/update |
| `brews/[id]/edit/page.tsx` | Verify edit form passes `brewed_at` correctly — same timezone issue may exist there |

---

## Feature 3: Shared brews / bags / recipes (future)

**Type:** Future feature
**Priority:** Low — design/planning only, no implementation yet
**Scope:** Cross-cutting (bags, brews, recipes)

### Problem

If two people buy the same bag or brew together, there is no way for both to log it without re-entering all data. There is also no concept of sharing a dialed-in recipe with someone else.

### User stories

1. **Shared bag** — I buy the same bag as a friend. I want to add it to my account from their bag without re-entering roaster, origin, process, etc.
2. **Shared brew** — We brew together. Both of us want it logged in our own accounts with our own ratings and notes.
3. **Shared recipe** — A friend has dialed in a great recipe for a bean. I want to copy it as a starting point for my own brews.

### Design options

**Option A: Copy / fork model**
A user forks another user's bag, brew, or recipe. Creates a full independent copy in their account. No live link after the fork. Simple, no relational complexity. Good for recipes.

**Option B: Share link / import (recommended)**
A user generates a share link for a bag or brew. The recipient opens it and imports it — again creates a copy in their account. Covers most use cases without requiring a social graph or mutual connection. Good starting point.

**Option C: Social graph + collaborative sessions**
Introduce a friends/follow system. Brews can be tagged "brewed together with @x". Both users see the brew with shared base data and individual notes/ratings on top. Most powerful but significant complexity. Out of scope for now.

### Recommendation

Start with **Option B** for bags and recipes. It covers 80% of the use case with minimal schema additions. Collaborative brew sessions can be added later.

### Rough schema addition (Option B)

```sql
create table bag_shares (
  id         uuid primary key default gen_random_uuid(),
  bag_id     uuid references bags(id) on delete cascade,
  created_by uuid references auth.users(id),
  token      text unique not null,
  expires_at timestamptz,
  created_at timestamptz default now()
);
```

Importing a shared bag creates a new `bags` row owned by the importing user, copying all fields except `user_id`.

### Open questions

- Should share links expire? If so, what default TTL?
- Should imported bags store a `source_bag_id` for provenance?
- Is recipe a first-class model yet, or still informal (brew notes + settings)?

---

*End of spec*

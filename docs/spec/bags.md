# Feature Spec — Bags

## Purpose

A Bag represents a physical bag of coffee. It is the central entity in Aroma — brew sessions link to bags, roast sessions generate bags. Users build a personal library of every coffee they've tried.

## Pages & Routes

- `/bags` — library view with filters and sorting
- `/bags/new` — form to add a new purchased bag
- `/bags/[id]` — detail view including all brew sessions for this bag
- `/bags/[id]/edit` — edit bag metadata

## Add Bag Form (`/bags/new`)

### Required
- **Name** — free text (e.g. "Yirgacheffe Natural")
- **Origin country** — select from predefined country list (see `/lib/constants/origins.ts`)

### Optional
- **Origin region** — free text
- **Roaster** — free text
- **Process** — select from `ProcessingMethod` enum
- **Varietal(s)** — multi-select or free-text tags (e.g. "Heirloom", "Bourbon")
- **Altitude (masl)** — number input
- **Roast level** — select from `RoastLevel` enum
- **Roast date** — date picker
- **Flavor notes** — multi-select from SCA wheel + free text entry
- **Rating** — 1–10 slider
- **Notes** — free text

### Info tooltips
Each field should have an optional info tooltip (ⓘ icon) that explains what it means:
- **Process**: Brief explanation with link to `/learn/processing`
- **Varietal**: Brief explanation with link to `/learn/varietals`
- **Altitude**: Brief explanation with link to `/learn/altitude`
- **Origin**: Brief description of the country/region with link to `/learn/origins/[country]`

These tooltips are the surface-level entry point to the Learn section.

## Bag Library (`/bags`)

### Display
- Grid of cards (default) or list view
- Card shows: name, origin, process, roast level, rating, number of brews logged
- Visual indicator if it's a home roast (small badge)

### Filters (sidebar or top bar)
- Country of origin
- Processing method
- Roast level
- Varietal (contains)
- Altitude range (slider)
- Rating (min)
- Home roast only toggle

### Sorting
- Date added (default: newest first)
- Rating
- Number of brews
- Roast date

## Bag Detail (`/bags/[id]`)

- Full metadata display
- **Brew history** section: list of all BrewSessions linked to this bag, newest first
  - Shows method, date, dose/out, rating for each
  - "Log a brew with this bag" CTA button
- **Average rating** across all brews (if any)
- Edit and Delete buttons

## Home-Roast Bags

Bags generated from a completed RoastSession are read-only in some fields (origin, varietal, process — inherited from the roast). Users can still add:
- Their own flavor notes
- Rating
- Free-text notes

The detail view shows a "View roast session" link back to the source RoastSession.

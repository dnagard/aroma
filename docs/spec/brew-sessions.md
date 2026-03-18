# Feature Spec — Brew Sessions

## Purpose

The brew log is the core of Aroma. Users record every brew they make, linking it to a bag of coffee. Over time this builds a searchable, filterable history of their brewing.

## Pages & Routes

- `/brew` — list of all brew sessions, newest first, with filters
- `/brew/new` — form to log a new brew session
- `/brew/[id]` — detail view of a single brew session
- `/brew/[id]/edit` — edit an existing session

## Brew Log Form (`/brew/new`)

### Required fields
- **Bag** — searchable select from user's Bags. Must be linked to a bag.
- **Date/time** — defaults to now, editable

### Optional fields (all nullable)
- **Method** — select from `BrewMethod` enum (espresso, pour over, aeropress, etc.)
- **Dose** — grams in (number input)
- **Out** — grams out / yield (number input; label changes based on method: "Yield" for filter, "Shot weight" for espresso)
- **Water** — ml/grams of water (shown for filter methods; hidden for espresso)
- **Temp** — brew temperature in °C
- **Brew time** — mm:ss input, stored as seconds
- **Grind size** — text field (free text, e.g. "18 clicks", "4 on Comandante")
- **TDS** — optional refractometer reading; if provided, auto-calculate extraction yield using: `EY = (TDS × brew_weight) / dose_grams`
- **Flavor notes** — multi-select from flavor wheel taxonomy + free text entry
- **Rating** — 1–10 slider (0.5 increments)
- **Notes** — free text area

### UX notes
- The form should feel fast. Defaults should be smart (pre-fill method from last session).
- On mobile, number inputs should use numeric keyboard.
- "Save" creates the record; "Save & New" saves and resets for another entry.

## Brew List (`/brew`)

### Display
- Card or table view toggle (user preference, persisted to localStorage)
- Each entry shows: bag name, method, date, rating, key numbers (dose/out or dose/yield)
- Clicking opens the detail view

### Filters
- Date range
- Method
- Bag (search by name)
- Rating (min)

### Sorting
- Date (default: newest first)
- Rating

## Detail View (`/brew/[id]`)

- Full read-only display of all recorded fields
- Shows linked bag name (with link to bag detail)
- Edit button → `/brew/[id]/edit`
- Delete button (with confirmation modal)

## Empty State

If no brews logged yet: friendly prompt to add their first brew, with a CTA to first add a bag if none exist.

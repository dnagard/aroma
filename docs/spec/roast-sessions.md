# Feature Spec — Roast Sessions

## Purpose

Home roasters can log their roasting sessions in detail. When a roast is marked complete, Aroma automatically creates a Bag record so the coffee is immediately available for brew logging.

## Pages & Routes

- `/roast` — list of all roast sessions
- `/roast/new` — log a new roast
- `/roast/[id]` — detail view
- `/roast/[id]/edit` — edit (only allowed if not yet marked complete)

## Roast Log Form (`/roast/new`)

### Green bean info (required)
- **Origin country** — select
- **Varietal(s)** — multi-select/tags
- **Process** — select from `ProcessingMethod`

### Green bean info (optional)
- **Origin region** — text
- **Altitude (masl)** — number
- **Supplier / source** — text

### Roast parameters (all optional)
- **Roaster machine** — text (e.g. "Bullet R1 V2")
- **Charge weight (g)** — number
- **Charge temp (°C)** — number
- **Drop weight (g)** — number (auto-calculates weight loss % if both charge and drop weights given)
- **Drop temp (°C)** — number
- **Total roast time** — mm:ss
- **First crack time** — mm:ss
- **Development time** — mm:ss (time from first crack to drop)
- **Target roast level** — select from `RoastLevel`
- **Actual roast level** — select (can differ from target; assessed after cooling)
- **Notes** — free text

### Completing a roast

A "Mark as Complete" button (separate from Save) finalizes the roast:
1. Validates that origin country and varietal are set
2. Creates a **Bag** record with:
   - `name` = auto-generated as "{Varietal} {Country}" (editable by user in a confirmation step)
   - `origin`, `process`, `varietal`, `altitude_masl` from the roast
   - `roast_date` = today
   - `actual_roast_level` → `roast_level`
   - `is_home_roast` = true
   - `roast_session_id` = this session's ID
3. Shows a success state: "Your roast is ready. {Bag name} has been added to your bag library."
4. CTA: "Log a brew with this coffee" → `/brew/new?bag_id={new_bag_id}`

Once marked complete, the roast session is locked (no edits). Users can view it but not change it.

## Roast List (`/roast`)

- Newest first
- Card shows: origin, varietal, date, roast level, weight loss % (if calculable)
- Badge: "Complete" or "In Progress"
- Clicking opens detail

## Roast Detail (`/roast/[id]`)

- Full parameter display
- Weight loss % displayed if both charge and drop weight are recorded: `((charge - drop) / charge) × 100`
- Development ratio: `development_time / total_time × 100`%
- If complete: link to generated Bag
- If not complete: "Mark as Complete" button + Edit button

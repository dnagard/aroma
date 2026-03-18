# Data Model — Aroma

This document defines the canonical data schema. All Supabase tables and TypeScript types should match this spec.

---

## Bag

Represents a physical bag of coffee, whether purchased or home-roasted.

```ts
type Bag = {
  id: uuid
  user_id: uuid                         // FK to auth.users
  name: string                          // e.g. "Ethiopia Yirgacheffe Natural"
  roaster: string | null                // Roaster name (if purchased)
  origin: {
    country: string                     // e.g. "Ethiopia"
    region: string | null               // e.g. "Yirgacheffe"
  }
  process: ProcessingMethod             // see enum below
  varietal: string[]                    // e.g. ["Heirloom", "74110"]
  altitude_masl: number | null          // meters above sea level
  roast_level: RoastLevel               // see enum below
  roast_date: date | null
  flavor_notes: string[]                // user-selected or custom strings
  rating: number | null                 // 1–10, can be decimal (e.g. 7.5)
  notes: string | null                  // free-text notes
  is_home_roast: boolean                // true if generated from a RoastSession
  roast_session_id: uuid | null         // FK to RoastSession if is_home_roast
  created_at: timestamp
  updated_at: timestamp
}

enum ProcessingMethod =
  | "washed"
  | "natural"
  | "honey"
  | "anaerobic_natural"
  | "anaerobic_washed"
  | "wet_hulled"
  | "carbonic_maceration"
  | "other"

enum RoastLevel =
  | "light"
  | "medium_light"
  | "medium"
  | "medium_dark"
  | "dark"
```

---

## BrewSession

A single brew log entry.

```ts
type BrewSession = {
  id: uuid
  user_id: uuid
  bag_id: uuid                          // FK to Bag (required)
  brewed_at: timestamp                  // when the brew happened
  method: BrewMethod                    // see enum below
  grind_size: string | null             // e.g. "medium-fine", or a number for EK43 clicks
  grind_setting: string | null          // optional machine-specific setting
  dose_grams: number | null             // coffee in (grams)
  out_grams: number | null              // espresso/liquid out (grams)
  water_grams: number | null            // water used (grams) — for filter methods
  brew_temp_celsius: number | null
  brew_time_seconds: number | null
  tds: number | null                    // optional refractometer reading
  extraction_yield: number | null       // calculated from TDS if provided
  flavor_notes: string[]                // tasting notes for this specific brew
  rating: number | null                 // 1–10 for this specific brew
  notes: string | null
  created_at: timestamp
  updated_at: timestamp
}

enum BrewMethod =
  | "espresso"
  | "pour_over"
  | "aeropress"
  | "french_press"
  | "moka_pot"
  | "cold_brew"
  | "siphon"
  | "chemex"
  | "v60"
  | "kalita"
  | "other"
```

---

## RoastSession

A roasting log. On completion, generates a Bag.

```ts
type RoastSession = {
  id: uuid
  user_id: uuid
  roasted_at: timestamp
  green_bean: {
    origin_country: string
    origin_region: string | null
    process: ProcessingMethod
    varietal: string[]
    altitude_masl: number | null
    supplier: string | null
  }
  roaster_machine: string | null        // e.g. "Bullet R1", "Hottop"
  charge_temp_celsius: number | null
  drop_temp_celsius: number | null
  development_time_seconds: number | null
  total_time_seconds: number | null
  charge_weight_grams: number | null
  drop_weight_grams: number | null      // used to calculate weight loss %
  first_crack_time_seconds: number | null
  target_roast_level: RoastLevel
  actual_roast_level: RoastLevel | null // assessed after roast
  notes: string | null
  is_complete: boolean                  // when true, a Bag is generated
  generated_bag_id: uuid | null         // FK to Bag once generated
  created_at: timestamp
  updated_at: timestamp
}
```

---

## Relationships

```
User
 ├── Bag[] (purchased or home-roasted)
 │    └── BrewSession[] (many brews per bag)
 └── RoastSession[]
      └── Bag (one bag generated per completed roast)
```

---

## Filtering

Bags support filtering on:
- `origin.country`, `origin.region`
- `process`
- `roast_level`
- `varietal` (array contains)
- `altitude_masl` (range)
- `rating` (range)
- `is_home_roast`

BrewSessions support filtering on:
- `bag_id`
- `method`
- `brewed_at` (date range)
- `rating` (range)

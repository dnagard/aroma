// ── Enums ─────────────────────────────────────────────────────────────────────

export type ProcessingMethod =
  | 'washed'
  | 'natural'
  | 'honey'
  | 'anaerobic_natural'
  | 'anaerobic_washed'
  | 'wet_hulled'
  | 'carbonic_maceration'
  | 'other'

export type RoastLevel =
  | 'light'
  | 'medium_light'
  | 'medium'
  | 'medium_dark'
  | 'dark'

export type BrewMethod =
  | 'espresso'
  | 'v60'
  | 'pour_over'
  | 'aeropress'
  | 'french_press'
  | 'chemex'
  | 'moka_pot'
  | 'cold_brew'
  | 'siphon'
  | 'kalita'
  | 'other'

// ── Bag ───────────────────────────────────────────────────────────────────────

export type Bag = {
  id: string
  user_id: string
  name: string
  roaster: string | null
  origin_country: string | null
  origin_region: string | null
  process: ProcessingMethod | null
  roast_level: RoastLevel | null
  roast_date: string | null           // ISO date string (YYYY-MM-DD)
  varietal: string[] | null
  altitude_masl: number | null
  flavor_notes: string[]
  rating: number | null               // 1.0–10.0, one decimal place
  notes: string | null
  is_home_roast: boolean
  roast_session_id: string | null     // FK → roast_sessions
  created_at: string                  // ISO timestamp
}

// ── BrewSession ───────────────────────────────────────────────────────────────

export type BrewSession = {
  id: string
  user_id: string
  bag_id: string                      // FK → bags (NOT NULL)
  brewed_at: string                   // ISO timestamp
  method: BrewMethod
  grind_size: string | null
  dose_grams: number | null
  out_grams: number | null
  water_grams: number | null
  brew_temp_c: number | null
  brew_time_s: number | null
  flavor_notes: string[]
  rating: number | null               // 1.0–10.0
  notes: string | null
  created_at: string
}

// ── RoastSession ──────────────────────────────────────────────────────────────

export type RoastSession = {
  id: string
  user_id: string
  roasted_at: string                  // ISO timestamp
  origin_country: string | null
  origin_region: string | null
  varietal: string[] | null
  process: ProcessingMethod | null
  altitude_masl: number | null
  charge_weight_g: number | null
  drop_weight_g: number | null
  charge_temp_c: number | null
  drop_temp_c: number | null
  total_time_s: number | null
  first_crack_s: number | null
  roast_level: RoastLevel | null
  notes: string | null
  is_complete: boolean
  generated_bag_id: string | null     // FK → bags (set when is_complete = true)
  created_at: string
}

# Feature Spec — Tasting Helper & Flavor Wheel

## Purpose

Help users articulate what they're tasting. The tasting helper guides them through a series of simple perceptual questions to narrow down their flavor experience. The flavor wheel lets them browse and select from the full SCA taxonomy.

## Components

### 1. Tasting Helper (`/components/tasting/TastingHelper`)

A guided, step-by-step questionnaire that surfaces relevant flavor descriptors.

**Step 1 — Overall impression**
> "What's your first impression?"
- Bright / acidic
- Balanced / sweet
- Heavy / roasty / bitter
- Clean / delicate

**Step 2 — Acidity character** (shown if Bright or Balanced selected)
> "How does the acidity feel?"
- Sharp, citrusy
- Soft, malic (apple-like)
- Winey, tartaric
- Gentle, phosphoric

**Step 3 — Body**
> "How does the coffee feel in your mouth?"
- Light, tea-like
- Medium, smooth
- Full, heavy, syrupy

**Step 4 — Flavor direction**
> "Do you notice any of these?"
(multi-select)
- Fruity
- Floral
- Sweet / caramel / chocolate
- Nutty / earthy
- Spicy / herbal
- Roasty / smoky

**Step 5 — Suggested notes**
Based on answers, surfaces a curated list of specific flavor descriptors from the SCA wheel taxonomy. User can tap to add each to their session.

The helper is embedded in the Brew Session form and Bag detail. It is optional — users can skip directly to the wheel.

---

### 2. Flavor Wheel (`/components/tasting/FlavorWheel`)

An interactive, multi-level flavor selector based on the SCA Coffee Taster's Flavor Wheel taxonomy.

**Levels:**
1. Category (e.g. Fruity, Floral, Sweet, Nutty/Cocoa, Spices, Roasted, Other)
2. Sub-category (e.g. Fruity → Berry, Dried Fruit, Citrus Fruit, Other Fruit)
3. Specific note (e.g. Berry → Blackberry, Raspberry, Blueberry, Strawberry)

**Interaction:**
- Click a category to expand sub-categories
- Click a sub-category to expand specific notes
- Click a specific note to select/deselect it
- Selected notes are shown in a "Your notes" chip list below the wheel
- Can also type free text to add custom notes not on the wheel

**Visual:**
- Implement as a segmented radial/donut chart (SVG or Canvas)
- Outer ring = specific notes, middle = sub-categories, inner = categories
- Color-coded by category (warm tones for roasty/nutty, cool for floral/fruity, etc.)
- Selected segments highlight visually

**Data source:**
The full SCA taxonomy is stored as a static JSON/TS constant at `/lib/constants/flavor-notes.ts`.

---

### 3. Flavor Notes Constant (`/lib/constants/flavor-notes.ts`)

Structure:
```ts
type FlavorCategory = {
  id: string
  label: string
  color: string
  subcategories: {
    id: string
    label: string
    notes: string[]
  }[]
}

export const FLAVOR_WHEEL: FlavorCategory[] = [...]
```

This is the single source of truth for all flavor taxonomy. It is used by both the wheel component and the tasting helper.

---

## Usage in Forms

Both the Tasting Helper and Flavor Wheel appear in:
- **BrewSession form** — to add tasting notes to a specific brew
- **Bag detail/edit** — to add general flavor notes to the bag itself

They output `string[]` which is stored in the `flavor_notes` field of the respective record.

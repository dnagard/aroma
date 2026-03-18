# Feature Spec — Export

## Purpose

Users can export their brew and bag data for personal archiving, sharing, or use in other tools.

## Export Targets

Two export types, two formats each:

| Target | Formats |
|---|---|
| Brew Sessions | Markdown, CSV |
| Bags | Markdown, CSV |

## Access

Export is accessible from:
- `/brew` list page → "Export" button (exports current filtered view)
- `/bags` list page → "Export" button (exports current filtered view)
- A dedicated `/export` page for bulk export with options

## Markdown Format

### Brew Sessions (Markdown)

```markdown
# Aroma Brew Log
Exported: 2024-11-15

---

## 2024-11-14 — Ethiopia Yirgacheffe Natural (Pour Over)

**Bag:** Ethiopia Yirgacheffe Natural (Onyx Coffee Lab)
**Method:** Pour Over
**Dose:** 18g → **Yield:** 280g (ratio 1:15.6)
**Temp:** 93°C
**Time:** 3:20
**Grind:** 22 clicks (Comandante)
**Rating:** 8/10

**Tasting notes:** Blueberry, jasmine, dark chocolate

> Really lovely this morning. Tried a slightly coarser grind than last time and it opened up the florals considerably.

---
```

### Bags (Markdown)

```markdown
# Aroma Bag Library
Exported: 2024-11-15

---

## Ethiopia Yirgacheffe Natural ★ 8.5/10

**Roaster:** Onyx Coffee Lab
**Origin:** Yirgacheffe, Ethiopia
**Process:** Natural
**Varietal:** Heirloom
**Altitude:** 1900 masl
**Roast level:** Light
**Roast date:** 2024-10-28

**Flavor notes:** Blueberry, jasmine, peach, dark chocolate

**Brews logged:** 4

> Outstanding bag. Extremely fruity and floral. Best as pour over at 93°C.

---
```

## CSV Format

### Brew Sessions CSV

Columns:
`date, bag_name, roaster, origin_country, origin_region, process, roast_level, method, dose_g, out_g, water_g, temp_c, brew_time_s, grind_size, tds, extraction_yield, flavor_notes, rating, notes`

- `flavor_notes` as semicolon-separated string: `"Blueberry;Jasmine;Peach"`
- Dates as ISO 8601: `2024-11-14T08:32:00`
- Nulls as empty string

### Bags CSV

Columns:
`name, roaster, origin_country, origin_region, process, varietal, altitude_masl, roast_level, roast_date, flavor_notes, rating, is_home_roast, brew_count, notes`

## Implementation Notes

- Export is client-side: fetch data from Supabase, generate file in browser, trigger download
- Use `Blob` + `URL.createObjectURL` for download
- Filename format: `aroma-brews-2024-11-15.md`, `aroma-bags-2024-11-15.csv`
- Export respects the currently active filters — "what you see is what you export"
- Show a count before export: "Export 47 brew sessions as Markdown?"
- No server-side processing needed for Phase 1

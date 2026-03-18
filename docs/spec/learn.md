# Feature Spec — Learn Section

## Purpose

The Learn section provides educational content about coffee. It serves two audiences: new coffee explorers and experienced users who want to understand what they're tasting and why. It is not user-generated — content is written once and shipped as static MDX.

## Philosophy

- Each article should answer "why does this matter for what's in my cup?"
- Practical over encyclopedic. Prioritize how each factor affects flavor.
- Short, scannable. Use subheadings, bullet points, and flavor-relevant callouts.

## Routes

- `/learn` — index of all topics
- `/learn/origins` — overview of coffee-growing regions
- `/learn/origins/[country]` — per-country detail (Ethiopia, Colombia, Guatemala, etc.)
- `/learn/processing` — overview of all processing methods
- `/learn/processing/[method]` — per-method detail
- `/learn/altitude` — how altitude affects flavor
- `/learn/varietals` — overview of bean varieties
- `/learn/varietals/[varietal]` — per-varietal detail (Bourbon, Typica, Geisha, etc.)
- `/learn/roast-levels` — how roast level affects flavor

## Content Outline

### Origins (`/learn/origins`)

**Top-level**: Why origin matters. The concept of terroir applied to coffee.

**Per country** (minimum coverage):
- Ethiopia — birthplace of coffee; heirloom varieties; Yirgacheffe, Sidama, Harrar
- Colombia — Huila, Nariño, cauca; classic mild washed profile
- Guatemala — Antigua, Huehuetenango; volcanic soil; caramel/chocolate tendency
- Kenya — AA grading; SL28/SL34 varietals; juicy, blackcurrant acidity
- Brazil — largest producer; naturals; low acidity, chocolate/nut profile
- Costa Rica — honey processes; La Minita; clean and sweet
- Yemen — cradle of coffee trade; dry-processed; complex, funky, wine-like
- Indonesia — wet-hulled (Giling Basah); Sumatra, Sulawesi; earthy, full-bodied

Each page covers: geography, typical flavor profile, notable varietals grown there, key regions within the country.

### Processing Methods (`/learn/processing`)

**Top-level**: What processing is and why it matters.

**Per method**:
- **Washed (wet)**: Fruit removed before drying. Clean, bright, origin-forward. Terroir expression.
- **Natural (dry)**: Whole cherry dried. Fruit ferments on bean. Fruity, wine-like, higher sweetness, more body. More variable.
- **Honey**: Partial pulp removal; mucilage left on. Spectrum from yellow → red → black honey. Balance between washed clarity and natural sweetness.
- **Anaerobic**: Fermented in sealed tanks without oxygen. Intensified fruit, unique fermentation flavors. Trendy in competition coffee.
- **Wet-hulled (Giling Basah)**: Specific to Indonesia. Hull removed at high moisture. Earthy, heavy body, low acidity.
- **Carbonic maceration**: Whole cherries fermented in CO₂. Very aromatic, wine-grape-like.

### Altitude (`/learn/altitude`)

- Higher altitude = cooler temperatures = slower cherry development = denser beans = more complex flavor
- General guide: <1000m (low), 1000–1500m (medium), 1500–2000m (high), >2000m (very high)
- Relationship to acidity: higher altitude tends toward brighter, more complex acidity
- SHB (Strictly Hard Bean) and SHG (Strictly High Grown) certifications explained

### Varietals (`/learn/varietals`)

**Top-level**: Arabica vs Robusta; what varietal means; how it affects cup profile.

**Per varietal** (minimum coverage):
- **Typica** — original Arabica; parent of many others; elegant, clean, low yield
- **Bourbon** — mutation of Typica; sweeter, complex; yellow, red, pink variants
- **Caturra** — natural mutation of Bourbon; compact plant; bright acidity
- **Catuai** — hybrid of Caturra × Mundo Novo; very common in Brazil/Central America
- **Geisha/Gesha** — from Ethiopia via Panama; floral, jasmine, tropical fruit; expensive
- **SL28 / SL34** — Kenyan selections; blackcurrant, complex acidity
- **Heirloom (Ethiopian)** — collective term for thousands of wild Ethiopian varieties; the genetic source
- **F1 Hybrids** — e.g. Centroamericano; disease resistance + cup quality; emerging trend

### Roast Levels (`/learn/roast-levels`)

- What happens chemically during roasting (Maillard, caramelization, first/second crack)
- Light: bright acidity, origin flavors preserved, lighter body
- Medium-light: balance of origin + roast character
- Medium: more body, less acidity, chocolate/caramel notes emerge
- Medium-dark: roast flavors dominant, oily surface, bittersweet
- Dark: roast character dominant, smoke/char notes, origin flavors lost

---

## Implementation Notes

- Content written as `.mdx` files in `/app/learn/content/`
- Rendered with a consistent layout component that includes a breadcrumb, a "related articles" section, and contextual links back to Bag fields
- No authentication required — learn content is public
- Static generation at build time (`generateStaticParams`)
- Internal links from Bag/Brew forms use tooltip popovers that show a short excerpt, not full navigation, to keep the user in their workflow

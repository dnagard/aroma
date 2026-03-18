export const BREW_METHOD_OPTIONS = [
  { value: 'espresso', label: 'Espresso' },
  { value: 'v60', label: 'V60' },
  { value: 'pour_over', label: 'Pour Over' },
  { value: 'aeropress', label: 'Aeropress' },
  { value: 'french_press', label: 'French Press' },
  { value: 'chemex', label: 'Chemex' },
  { value: 'moka_pot', label: 'Moka Pot' },
  { value: 'cold_brew', label: 'Cold Brew' },
  { value: 'siphon', label: 'Siphon' },
  { value: 'kalita', label: 'Kalita' },
  { value: 'other', label: 'Other' },
] as const

export const BREW_METHOD_LABELS: Record<string, string> = Object.fromEntries(
  BREW_METHOD_OPTIONS.map(({ value, label }) => [value, label])
)

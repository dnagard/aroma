export type FlavorNote = {
  id: string
  label: string
  notes: string[]
}

export type FlavorCategory = {
  id: string
  label: string
  color: string
  subcategories: FlavorNote[]
}

export const FLAVOR_WHEEL: FlavorCategory[] = [
  {
    id: 'fruity',
    label: 'Fruity',
    color: '#e85d4a',
    subcategories: [
      {
        id: 'berry',
        label: 'Berry',
        notes: ['Blackberry', 'Raspberry', 'Blueberry', 'Strawberry'],
      },
      {
        id: 'dried-fruit',
        label: 'Dried Fruit',
        notes: ['Raisin', 'Prune', 'Date', 'Fig'],
      },
      {
        id: 'citrus',
        label: 'Citrus Fruit',
        notes: ['Grapefruit', 'Orange', 'Lemon', 'Lime'],
      },
      {
        id: 'other-fruit',
        label: 'Other Fruit',
        notes: ['Coconut', 'Cherry', 'Pomegranate', 'Pineapple', 'Grape', 'Apple', 'Peach', 'Pear'],
      },
    ],
  },
  {
    id: 'floral',
    label: 'Floral',
    color: '#c084fc',
    subcategories: [
      {
        id: 'black-tea',
        label: 'Black Tea',
        notes: ['Black Tea'],
      },
      {
        id: 'floral-notes',
        label: 'Floral',
        notes: ['Chamomile', 'Rose', 'Jasmine', 'Lavender'],
      },
    ],
  },
  {
    id: 'sweet',
    label: 'Sweet',
    color: '#f59e0b',
    subcategories: [
      {
        id: 'overall-sweet',
        label: 'Overall Sweet',
        notes: ['Sweet'],
      },
      {
        id: 'vanilla',
        label: 'Vanilla',
        notes: ['Vanilla'],
      },
      {
        id: 'caramelised',
        label: 'Caramelised',
        notes: ['Caramel', 'Toffee', 'Brown Sugar', 'Molasses', 'Honey', 'Maple Syrup'],
      },
      {
        id: 'chocolate',
        label: 'Chocolate',
        notes: ['Dark Chocolate', 'Milk Chocolate', 'Cocoa'],
      },
    ],
  },
  {
    id: 'nutty-cocoa',
    label: 'Nutty/Cocoa',
    color: '#92400e',
    subcategories: [
      {
        id: 'nutty',
        label: 'Nutty',
        notes: ['Peanuts', 'Hazelnut', 'Almond', 'Walnut', 'Pecan'],
      },
      {
        id: 'cocoa',
        label: 'Cocoa',
        notes: ['Cocoa', 'Dark Chocolate'],
      },
    ],
  },
  {
    id: 'spices',
    label: 'Spices',
    color: '#f97316',
    subcategories: [
      {
        id: 'pungent',
        label: 'Pungent',
        notes: ['Anise', 'Pepper'],
      },
      {
        id: 'brown-spice',
        label: 'Brown Spice',
        notes: ['Cinnamon', 'Clove', 'Cardamom', 'Nutmeg', 'Allspice'],
      },
    ],
  },
  {
    id: 'roasted',
    label: 'Roasted',
    color: '#374151',
    subcategories: [
      {
        id: 'cereal',
        label: 'Cereal',
        notes: ['Grain', 'Malt'],
      },
      {
        id: 'burnt',
        label: 'Burnt',
        notes: ['Acrid', 'Ashy', 'Smoky', 'Brown Roast'],
      },
      {
        id: 'tobacco',
        label: 'Tobacco',
        notes: ['Tobacco'],
      },
    ],
  },
  {
    id: 'other',
    label: 'Other',
    color: '#6b7280',
    subcategories: [
      {
        id: 'chemical',
        label: 'Chemical',
        notes: ['Bitter', 'Salty', 'Medicinal', 'Petroleum', 'Skunky', 'Rubber'],
      },
      {
        id: 'papery-musty',
        label: 'Papery/Musty',
        notes: ['Stale', 'Cardboard', 'Papery', 'Woody', 'Musty', 'Earthy', 'Moldy'],
      },
      {
        id: 'veggie',
        label: 'Veggie',
        notes: ['Olive Oil', 'Raw', 'Green/Vegetative', 'Beany', 'Hay/Straw'],
      },
    ],
  },
]

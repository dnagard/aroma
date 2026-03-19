'use client'

import { useState, KeyboardEvent } from 'react'
import { FLAVOR_WHEEL } from '@/lib/constants/flavor-notes'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type Props = {
  defaultTags?: string[]
}

export function FlavorSelector({ defaultTags = [] }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [selectedNotes, setSelectedNotes] = useState<string[]>(defaultTags)
  const [customInput, setCustomInput] = useState('')

  const activeCategory = FLAVOR_WHEEL.find((c) => c.id === selectedCategory)
  const activeSubcategory = activeCategory?.subcategories.find((s) => s.id === selectedSubcategory)

  function handleSelectCategory(id: string) {
    setSelectedCategory((prev) => (prev === id ? null : id))
    setSelectedSubcategory(null)
  }

  function handleSelectSubcategory(id: string) {
    setSelectedSubcategory((prev) => (prev === id ? null : id))
  }

  function toggleNote(note: string) {
    setSelectedNotes((prev) =>
      prev.includes(note) ? prev.filter((n) => n !== note) : [...prev, note]
    )
  }

  function removeNote(note: string) {
    setSelectedNotes((prev) => prev.filter((n) => n !== note))
  }

  function commitCustomInput() {
    const value = customInput.trim()
    if (value && !selectedNotes.includes(value)) {
      setSelectedNotes((prev) => [...prev, value])
    }
    setCustomInput('')
  }

  function handleCustomKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      commitCustomInput()
    }
  }

  return (
    <div className="space-y-3">
      <Label>Tasting notes</Label>

      {/* Three-column drill-down */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:border sm:h-48 rounded-md overflow-hidden">
        {/* Column 1 — Categories */}
        <div className="relative overflow-y-auto h-full">
          {FLAVOR_WHEEL.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleSelectCategory(cat.id)}
              className={cn(
                'flex items-center gap-2 w-full px-3 py-2 text-sm text-left transition-colors hover:bg-muted',
                selectedCategory === cat.id && 'bg-muted font-medium'
              )}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              {cat.label}
            </button>
          ))}
          <div className="pointer-events-none absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-background to-transparent" />
        </div>

        {/* Column 2 — Subcategories */}
        <div className="overflow-y-auto h-full">
          {activeCategory ? (
            activeCategory.subcategories.map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => handleSelectSubcategory(sub.id)}
                className={cn(
                  'w-full px-3 py-2 text-sm text-left transition-colors hover:bg-muted',
                  selectedSubcategory === sub.id && 'bg-muted font-medium'
                )}
              >
                {sub.label}
              </button>
            ))
          ) : (
            <p className="px-3 py-2 text-sm text-muted-foreground">Select a category</p>
          )}
        </div>

        {/* Column 3 — Notes */}
        <div className="overflow-y-auto h-full">
          {activeSubcategory ? (
            activeSubcategory.notes.map((note) => (
              <button
                key={note}
                type="button"
                onClick={() => toggleNote(note)}
                className={cn(
                  'w-full px-3 py-2 text-sm text-left transition-colors hover:bg-muted',
                  selectedNotes.includes(note) && 'bg-muted font-medium'
                )}
              >
                {selectedNotes.includes(note) ? '✓ ' : ''}{note}
              </button>
            ))
          ) : (
            <p className="px-3 py-2 text-sm text-muted-foreground">Select a subcategory</p>
          )}
        </div>
      </div>

      {/* Custom note input */}
      <Input
        type="text"
        placeholder="Add a custom note (Enter or comma to add)"
        value={customInput}
        onChange={(e) => setCustomInput(e.target.value)}
        onKeyDown={handleCustomKeyDown}
        onBlur={commitCustomInput}
      />

      {/* Selected notes pills */}
      {selectedNotes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedNotes.map((note) => (
            <Badge key={note} variant="secondary" className="gap-1 pr-1">
              {note}
              <button
                type="button"
                onClick={() => removeNote(note)}
                className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5 leading-none"
                aria-label={`Remove ${note}`}
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Hidden inputs for form submission */}
      {selectedNotes.map((note) => (
        <input key={note} type="hidden" name="flavor_notes[]" value={note} />
      ))}
    </div>
  )
}

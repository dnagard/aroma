'use client'

import { useState, KeyboardEvent } from 'react'
import { FLAVOR_WHEEL } from '@/lib/constants/flavor-notes'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
} from '@/components/ui/drawer'
import { cn } from '@/lib/utils'

type Props = {
  defaultTags?: string[]
}

type DrawerPanel = 'categories' | 'subcategories' | 'notes'

export function FlavorSelector({ defaultTags = [] }: Props) {
  // Shared state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [selectedNotes, setSelectedNotes] = useState<string[]>(defaultTags)
  const [customInput, setCustomInput] = useState('')

  // Mobile drawer state
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerPanel, setDrawerPanel] = useState<DrawerPanel>('categories')

  const activeCategory = FLAVOR_WHEEL.find((c) => c.id === selectedCategory)
  const activeSubcategory = activeCategory?.subcategories.find((s) => s.id === selectedSubcategory)

  // Desktop handlers
  function handleSelectCategory(id: string) {
    setSelectedCategory((prev) => (prev === id ? null : id))
    setSelectedSubcategory(null)
  }

  function handleSelectSubcategory(id: string) {
    setSelectedSubcategory((prev) => (prev === id ? null : id))
  }

  // Mobile drawer handlers
  function handleDrawerCategorySelect(id: string) {
    setSelectedCategory(id)
    setDrawerPanel('subcategories')
  }

  function handleDrawerSubcategorySelect(id: string) {
    setSelectedSubcategory(id)
    setDrawerPanel('notes')
  }

  function handleDrawerBack() {
    if (drawerPanel === 'notes') {
      setSelectedSubcategory(null)
      setDrawerPanel('subcategories')
    } else if (drawerPanel === 'subcategories') {
      setSelectedCategory(null)
      setDrawerPanel('categories')
    }
  }

  function handleDrawerOpenChange(open: boolean) {
    setDrawerOpen(open)
    if (!open) {
      setDrawerPanel('categories')
      setSelectedCategory(null)
      setSelectedSubcategory(null)
    }
  }

  // Shared note handlers
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

  // Breadcrumb label for mobile drawer
  function getBreadcrumb() {
    if (drawerPanel === 'subcategories' && activeCategory) {
      return activeCategory.label
    }
    if (drawerPanel === 'notes' && activeCategory && activeSubcategory) {
      return `${activeCategory.label} › ${activeSubcategory.label}`
    }
    return null
  }

  const breadcrumb = getBreadcrumb()

  return (
    <div className="space-y-3">
      <Label>Tasting notes</Label>

      {/* Mobile: trigger button + Drawer */}
      <div className="md:hidden">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => setDrawerOpen(true)}
        >
          Add tasting notes
          {selectedNotes.length > 0 ? ` (${selectedNotes.length} selected)` : ''}
        </Button>

        <Drawer open={drawerOpen} onOpenChange={handleDrawerOpenChange}>
          <DrawerContent>
            <DrawerTitle className="px-4 pt-4 pb-1 text-center text-base font-semibold">Select tasting notes</DrawerTitle>
            {/* Back nav / breadcrumb */}
            {breadcrumb && (
              <div className="flex items-center gap-2 px-4 pt-4">
                <button
                  type="button"
                  onClick={handleDrawerBack}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Go back"
                >
                  ← {breadcrumb}
                </button>
              </div>
            )}

            {/* Panel content */}
            <div className="flex-1 overflow-y-auto px-2 py-2 max-h-[60vh]">
              {drawerPanel === 'categories' &&
                FLAVOR_WHEEL.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleDrawerCategorySelect(cat.id)}
                    className="flex items-center gap-3 w-full px-3 py-3 text-sm text-left rounded-md transition-colors hover:bg-muted"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.label}
                  </button>
                ))}

              {drawerPanel === 'subcategories' &&
                activeCategory?.subcategories.map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => handleDrawerSubcategorySelect(sub.id)}
                    className="w-full px-3 py-3 text-sm text-left rounded-md transition-colors hover:bg-muted"
                  >
                    {sub.label}
                  </button>
                ))}

              {drawerPanel === 'notes' &&
                activeSubcategory?.notes.map((note) => (
                  <button
                    key={note}
                    type="button"
                    onClick={() => toggleNote(note)}
                    className={cn(
                      'w-full px-3 py-3 text-sm text-left rounded-md transition-colors hover:bg-muted',
                      selectedNotes.includes(note) && 'bg-muted font-medium'
                    )}
                  >
                    {selectedNotes.includes(note) ? '✓ ' : ''}{note}
                  </button>
                ))}
            </div>

            <DrawerFooter>
              <Button className="w-full" onClick={() => setDrawerOpen(false)}>
                Done
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Desktop: existing three-column drill-down */}
      <div className="hidden md:block">
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
      </div>

      {/* Selected notes pills — always visible */}
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

      {/* Custom note input — always visible, below pills */}
      <div className="space-y-1.5">
        <Label htmlFor="custom-note-input">Add custom note</Label>
        <Input
          id="custom-note-input"
          type="text"
          placeholder="Type a note and press Enter or comma"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={handleCustomKeyDown}
          onBlur={commitCustomInput}
        />
      </div>

      {/* Hidden inputs for form submission */}
      {selectedNotes.map((note) => (
        <input key={note} type="hidden" name="flavor_notes[]" value={note} />
      ))}
    </div>
  )
}

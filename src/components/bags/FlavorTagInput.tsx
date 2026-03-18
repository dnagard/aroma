'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Props = {
  name: string
  label: string
  helperText?: string
  placeholder?: string
  defaultTags?: string[]
}

export function FlavorTagInput({ name, label, helperText, placeholder, defaultTags = [] }: Props) {
  const [tags, setTags] = useState<string[]>(defaultTags)
  const [inputValue, setInputValue] = useState('')

  function commit(raw: string) {
    const trimmed = raw.replace(/,+$/, '').trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags(prev => [...prev, trimmed])
    }
    setInputValue('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      commit(inputValue)
    } else if (e.key === ',') {
      e.preventDefault()
      commit(inputValue)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    if (val.endsWith(',')) {
      commit(val)
    } else {
      setInputValue(val)
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}
      {tags.map(tag => (
        <input key={tag} type="hidden" name={name} value={tag} />
      ))}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm"
            >
              {tag}
              <button
                type="button"
                aria-label={`Remove ${tag}`}
                onClick={() => setTags(prev => prev.filter(t => t !== tag))}
                className="ml-1 text-muted-foreground hover:text-foreground leading-none"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <Input
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
    </div>
  )
}

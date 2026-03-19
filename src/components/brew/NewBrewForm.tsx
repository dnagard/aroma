'use client'

import { useActionState, useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { BREW_METHOD_OPTIONS, BREW_METHOD_LABELS } from '@/lib/constants/methods'
import { FlavorSelector } from '@/components/brew/FlavorSelector'
import { createClient } from '@/lib/supabase/client'
import type { CreateBrewState } from '@/app/(protected)/brews/actions'
import type { Bag, BrewSession } from '@/types'

type Props = {
  action: (prevState: CreateBrewState, formData: FormData) => Promise<CreateBrewState>
  bags: Pick<Bag, 'id' | 'name'>[]
  defaultBrewedAt: string
  defaultBagId?: string
}

function useLastBrew(bagId: string | null, method: string | null): BrewSession | null {
  const [lastBrew, setLastBrew] = useState<BrewSession | null>(null)

  useEffect(() => {
    if (!bagId || !method) return

    let cancelled = false
    const supabase = createClient()

    supabase
      .from('brew_sessions')
      .select('*')
      .eq('bag_id', bagId)
      .eq('method', method)
      .order('brewed_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setLastBrew(data)
      })

    return () => { cancelled = true }
  }, [bagId, method])

  // Return null when the cached result is stale (bag or method changed before fetch resolves)
  if (lastBrew && (lastBrew.bag_id !== bagId || lastBrew.method !== method)) return null
  return lastBrew
}

export function NewBrewForm({ action, bags, defaultBrewedAt, defaultBagId }: Props) {
  const [state, formAction, pending] = useActionState(action, null)

  const [bagId, setBagId] = useState<string | null>(defaultBagId ?? null)
  const [method, setMethod] = useState<string | null>(null)
  const [showFullNote, setShowFullNote] = useState(false)

  const [doseGrams, setDoseGrams] = useState('')
  const [outGrams, setOutGrams] = useState('')
  const [waterGrams, setWaterGrams] = useState('')
  const [brewTempC, setBrewTempC] = useState('')
  const [brewTimeM, setBrewTimeM] = useState('')
  const [brewTimeSec, setBrewTimeSec] = useState('')
  const [grindSize, setGrindSize] = useState('')

  const lastBrew = useLastBrew(bagId, method)

  function resetFields() {
    setDoseGrams('')
    setOutGrams('')
    setWaterGrams('')
    setBrewTempC('')
    setBrewTimeM('')
    setBrewTimeSec('')
    setGrindSize('')
    setShowFullNote(false)
  }

  function handleBagChange(value: string) {
    setBagId(value)
    resetFields()
  }

  function handleMethodChange(value: string) {
    setMethod(value)
    resetFields()
  }

  function applyLastValues() {
    if (!lastBrew) return
    if (lastBrew.dose_grams != null) setDoseGrams(String(lastBrew.dose_grams))
    if (lastBrew.out_grams != null) setOutGrams(String(lastBrew.out_grams))
    if (lastBrew.water_grams != null) setWaterGrams(String(lastBrew.water_grams))
    if (lastBrew.brew_temp_c != null) setBrewTempC(String(lastBrew.brew_temp_c))
    if (lastBrew.brew_time_s != null) {
      setBrewTimeM(String(Math.floor(lastBrew.brew_time_s / 60)))
      setBrewTimeSec(String(lastBrew.brew_time_s % 60))
    }
    if (lastBrew.grind_size != null) setGrindSize(lastBrew.grind_size)
  }

  const lastBrewDate = lastBrew
    ? new Date(lastBrew.brewed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null

  const hasLongNote = (lastBrew?.notes?.length ?? 0) > 100
  const noteSnippet = lastBrew?.notes
    ? hasLongNote
      ? lastBrew.notes.slice(0, 100) + '…'
      : lastBrew.notes
    : null

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>Brew details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {state?.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}

          <div className="space-y-2">
            <Label htmlFor="bag_id">Bag *</Label>
            <Select
              name="bag_id"
              required
              defaultValue={defaultBagId ?? undefined}
              onValueChange={handleBagChange}
            >
              <SelectTrigger id="bag_id">
                <SelectValue placeholder="Select a bag" />
              </SelectTrigger>
              <SelectContent>
                {bags.map((bag) => (
                  <SelectItem key={bag.id} value={bag.id}>
                    {bag.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="method">Method *</Label>
            <Select name="method" required onValueChange={handleMethodChange}>
              <SelectTrigger id="method">
                <SelectValue placeholder="Select a method" />
              </SelectTrigger>
              <SelectContent>
                {BREW_METHOD_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {lastBrew && (
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={applyLastValues}
              >
                Use last {BREW_METHOD_LABELS[method!]} values ({lastBrewDate})
              </Button>
              {noteSnippet && (
                <p className="border-l-2 pl-3 text-sm italic text-muted-foreground">
                  &ldquo;{showFullNote ? lastBrew.notes : noteSnippet}&rdquo;
                  {hasLongNote && (
                    <button
                      type="button"
                      className="ml-1 underline"
                      onClick={() => setShowFullNote((v) => !v)}
                    >
                      {showFullNote ? 'Show less' : 'Show more'}
                    </button>
                  )}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="brewed_at">Date &amp; time</Label>
            <Input
              id="brewed_at"
              name="brewed_at"
              type="datetime-local"
              defaultValue={defaultBrewedAt}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dose_grams">Dose (g)</Label>
              <Input
                id="dose_grams"
                name="dose_grams"
                type="number"
                min={0}
                step={0.1}
                placeholder="e.g. 18"
                inputMode="decimal"
                value={doseGrams}
                onChange={(e) => setDoseGrams(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="out_grams">Out (g)</Label>
              <Input
                id="out_grams"
                name="out_grams"
                type="number"
                min={0}
                step={0.1}
                placeholder="e.g. 36"
                inputMode="decimal"
                value={outGrams}
                onChange={(e) => setOutGrams(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="water_grams">Water (g)</Label>
              <Input
                id="water_grams"
                name="water_grams"
                type="number"
                min={0}
                step={1}
                placeholder="e.g. 300"
                inputMode="decimal"
                value={waterGrams}
                onChange={(e) => setWaterGrams(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brew_temp_c">Temp (°C)</Label>
              <Input
                id="brew_temp_c"
                name="brew_temp_c"
                type="number"
                min={0}
                step={0.5}
                placeholder="e.g. 93"
                inputMode="decimal"
                value={brewTempC}
                onChange={(e) => setBrewTempC(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Brew time</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="brew_time_m"
                  name="brew_time_m"
                  type="number"
                  min={0}
                  max={99}
                  placeholder="min"
                  inputMode="numeric"
                  value={brewTimeM}
                  onChange={(e) => setBrewTimeM(e.target.value)}
                />
                <span className="text-muted-foreground">:</span>
                <Input
                  id="brew_time_s"
                  name="brew_time_s"
                  type="number"
                  min={0}
                  max={59}
                  placeholder="sec"
                  inputMode="numeric"
                  value={brewTimeSec}
                  onChange={(e) => setBrewTimeSec(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grind_size">Grind size</Label>
              <Input
                id="grind_size"
                name="grind_size"
                placeholder="e.g. 18 clicks"
                value={grindSize}
                onChange={(e) => setGrindSize(e.target.value)}
              />
            </div>
          </div>

          <FlavorSelector />

          <div className="space-y-2">
            <Label htmlFor="rating">Rating (1–10)</Label>
            <Input
              id="rating"
              name="rating"
              type="number"
              min={1}
              max={10}
              step={0.5}
              placeholder="e.g. 8.5"
              inputMode="decimal"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="What stood out? What would you change?"
              rows={4}
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={pending}>
              {pending ? 'Saving…' : 'Log brew'}
            </Button>
            <Button variant="outline" asChild>
              <Link href="/brews">Cancel</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}

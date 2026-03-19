'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { BREW_METHOD_OPTIONS } from '@/lib/constants/methods'
import { FlavorSelector } from '@/components/brew/FlavorSelector'
import type { UpdateBrewState } from '@/app/(protected)/brews/actions'
import type { Bag, BrewSession } from '@/types'

type Props = {
  brew: BrewSession
  bags: Pick<Bag, 'id' | 'name'>[]
  action: (prevState: UpdateBrewState, formData: FormData) => Promise<UpdateBrewState>
}

export function EditBrewForm({ brew, bags, action }: Props) {
  const [state, formAction, pending] = useActionState(action, null)

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={brew.id} />
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
            <Select name="bag_id" required defaultValue={brew.bag_id}>
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
            <Select name="method" required defaultValue={brew.method}>
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

          <div className="space-y-2">
            <Label htmlFor="brewed_at">Date &amp; time</Label>
            <Input
              id="brewed_at"
              name="brewed_at"
              type="datetime-local"
              defaultValue={brew.brewed_at.slice(0, 16)}
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
                defaultValue={brew.dose_grams?.toString() ?? ''}
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
                defaultValue={brew.out_grams?.toString() ?? ''}
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
                defaultValue={brew.water_grams?.toString() ?? ''}
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
                defaultValue={brew.brew_temp_c?.toString() ?? ''}
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
                  defaultValue={brew.brew_time_s != null ? Math.floor(brew.brew_time_s / 60).toString() : ''}
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
                  defaultValue={brew.brew_time_s != null ? (brew.brew_time_s % 60).toString() : ''}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grind_size">Grind size</Label>
              <Input
                id="grind_size"
                name="grind_size"
                placeholder="e.g. 18 clicks"
                defaultValue={brew.grind_size ?? ''}
              />
            </div>
          </div>

          <FlavorSelector defaultTags={brew.flavor_notes} />

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
              defaultValue={brew.rating?.toString() ?? ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="What stood out? What would you change?"
              rows={4}
              defaultValue={brew.notes ?? ''}
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={pending}>
              {pending ? 'Saving…' : 'Save changes'}
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/brews/${brew.id}`}>Cancel</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}

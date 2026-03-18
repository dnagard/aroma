'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { COFFEE_ORIGINS } from '@/lib/constants/origins'
import type { CreateBagState } from '@/app/(protected)/bags/actions'

const PROCESS_OPTIONS = [
  { value: 'washed', label: 'Washed' },
  { value: 'natural', label: 'Natural' },
  { value: 'honey', label: 'Honey' },
  { value: 'anaerobic_natural', label: 'Anaerobic Natural' },
  { value: 'anaerobic_washed', label: 'Anaerobic Washed' },
  { value: 'wet_hulled', label: 'Wet Hulled' },
  { value: 'carbonic_maceration', label: 'Carbonic Maceration' },
  { value: 'other', label: 'Other' },
] as const

const ROAST_LEVEL_OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'medium_light', label: 'Medium Light' },
  { value: 'medium', label: 'Medium' },
  { value: 'medium_dark', label: 'Medium Dark' },
  { value: 'dark', label: 'Dark' },
] as const

type Props = {
  action: (prevState: CreateBagState, formData: FormData) => Promise<CreateBagState>
}

export function NewBagForm({ action }: Props) {
  const [state, formAction, pending] = useActionState(action, null)

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>Bag details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {state?.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" name="name" placeholder="e.g. Yirgacheffe Natural" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="roaster">Roaster</Label>
            <Input id="roaster" name="roaster" placeholder="e.g. Blue Bottle" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="origin_country">Origin country</Label>
              <Select name="origin_country">
                <SelectTrigger id="origin_country">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {COFFEE_ORIGINS.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="origin_region">Origin region</Label>
              <Input id="origin_region" name="origin_region" placeholder="e.g. Sidamo" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="process">Process</Label>
              <Select name="process">
                <SelectTrigger id="process">
                  <SelectValue placeholder="Select process" />
                </SelectTrigger>
                <SelectContent>
                  {PROCESS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roast_level">Roast level</Label>
              <Select name="roast_level">
                <SelectTrigger id="roast_level">
                  <SelectValue placeholder="Select roast level" />
                </SelectTrigger>
                <SelectContent>
                  {ROAST_LEVEL_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="roast_date">Roast date</Label>
              <Input id="roast_date" name="roast_date" type="date" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="altitude_masl">Altitude (masl)</Label>
              <Input id="altitude_masl" name="altitude_masl" type="number" min={0} placeholder="e.g. 1800" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="varietal">Varietal(s)</Label>
            <Input id="varietal" name="varietal" placeholder="e.g. Heirloom, Bourbon (comma-separated)" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating">Rating (1–10)</Label>
            <Input id="rating" name="rating" type="number" min={1} max={10} step={0.1} placeholder="e.g. 8.5" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" placeholder="Tasting notes, context, anything you want to remember…" rows={4} />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={pending}>
              {pending ? 'Saving…' : 'Add bag'}
            </Button>
            <Button variant="outline" asChild>
              <Link href="/bags">Cancel</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}

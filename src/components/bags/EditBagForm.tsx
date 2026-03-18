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
import type { UpdateBagState } from '@/app/(protected)/bags/actions'
import type { Bag } from '@/types'

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
  bag: Bag
  action: (prevState: UpdateBagState, formData: FormData) => Promise<UpdateBagState>
}

export function EditBagForm({ bag, action }: Props) {
  const [state, formAction, pending] = useActionState(action, null)

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={bag.id} />
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
            <Input id="name" name="name" placeholder="e.g. Yirgacheffe Natural" required defaultValue={bag.name} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="roaster">Roaster</Label>
            <Input id="roaster" name="roaster" placeholder="e.g. Blue Bottle" defaultValue={bag.roaster ?? ''} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="origin_country">Origin country</Label>
              <Select name="origin_country" defaultValue={bag.origin_country ?? 'none'}>
                <SelectTrigger id="origin_country">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Not specified</SelectItem>
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
              <Input id="origin_region" name="origin_region" placeholder="e.g. Sidamo" defaultValue={bag.origin_region ?? ''} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="process">Process</Label>
              <Select name="process" defaultValue={bag.process ?? 'none'}>
                <SelectTrigger id="process">
                  <SelectValue placeholder="Select process" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Not specified</SelectItem>
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
              <Select name="roast_level" defaultValue={bag.roast_level ?? 'none'}>
                <SelectTrigger id="roast_level">
                  <SelectValue placeholder="Select roast level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Not specified</SelectItem>
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
              <Input id="roast_date" name="roast_date" type="date" defaultValue={bag.roast_date ?? ''} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="altitude_masl">Altitude (masl)</Label>
              <Input
                id="altitude_masl"
                name="altitude_masl"
                type="number"
                min={0}
                placeholder="e.g. 1800"
                defaultValue={bag.altitude_masl?.toString() ?? ''}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="varietal">Varietal(s)</Label>
            <Input
              id="varietal"
              name="varietal"
              placeholder="e.g. Heirloom, Bourbon (comma-separated)"
              defaultValue={bag.varietal?.join(', ') ?? ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating">Rating (1–10)</Label>
            <Input
              id="rating"
              name="rating"
              type="number"
              min={1}
              max={10}
              step={0.1}
              placeholder="e.g. 8.5"
              defaultValue={bag.rating?.toString() ?? ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Tasting notes, context, anything you want to remember…"
              rows={4}
              defaultValue={bag.notes ?? ''}
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={pending}>
              {pending ? 'Saving…' : 'Save changes'}
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/bags/${bag.id}`}>Cancel</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}

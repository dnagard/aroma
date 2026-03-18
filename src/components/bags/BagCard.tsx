import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Bag } from '@/types'

const PROCESS_LABELS: Record<string, string> = {
  washed: 'Washed',
  natural: 'Natural',
  honey: 'Honey',
  anaerobic_natural: 'Anaerobic Natural',
  anaerobic_washed: 'Anaerobic Washed',
  wet_hulled: 'Wet Hulled',
  carbonic_maceration: 'Carbonic Maceration',
  other: 'Other',
}

const ROAST_LEVEL_LABELS: Record<string, string> = {
  light: 'Light',
  medium_light: 'Medium Light',
  medium: 'Medium',
  medium_dark: 'Medium Dark',
  dark: 'Dark',
}

type Props = {
  bag: Bag
}

export function BagCard({ bag }: Props) {
  return (
    <Link href={`/bags/${bag.id}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg">
      <Card className="h-full transition-colors hover:bg-accent/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base leading-snug">{bag.name}</CardTitle>
          {bag.is_home_roast && (
            <span className="inline-flex w-fit items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
              Home roast
            </span>
          )}
        </CardHeader>
        <CardContent className="space-y-1 text-sm text-muted-foreground">
          {bag.origin_country && <p>{bag.origin_country}</p>}
          {bag.process && <p>{PROCESS_LABELS[bag.process] ?? bag.process}</p>}
          {bag.roast_level && <p>{ROAST_LEVEL_LABELS[bag.roast_level] ?? bag.roast_level}</p>}
          <p className="pt-1 font-medium text-foreground">
            {bag.rating != null ? `${bag.rating} / 10` : '—'}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}

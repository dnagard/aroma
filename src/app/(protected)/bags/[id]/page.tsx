import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { deleteBagAction } from '../actions'
import type { Bag } from '@/types'

function formatEnumValue(value: string): string {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium">{children}</dd>
    </div>
  )
}

export default async function BagDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: bag, error } = await supabase
    .from('bags')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single<Bag>()

  if (error || !bag) {
    redirect('/bags')
  }

  const deleteWithId = deleteBagAction.bind(null, bag.id)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-semibold">{bag.name}</h1>
            {bag.is_home_roast && (
              <Badge variant="secondary">Home Roast</Badge>
            )}
          </div>
          {bag.roaster && (
            <p className="text-muted-foreground text-sm">{bag.roaster}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/bags/${bag.id}/edit`}>Edit</Link>
          </Button>
          <form action={deleteWithId}>
            <Button variant="destructive" size="sm" type="submit">
              Delete
            </Button>
          </form>
        </div>
      </div>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            {bag.origin_country && (
              <MetaRow label="Origin">
                {bag.origin_country}
                {bag.origin_region && `, ${bag.origin_region}`}
              </MetaRow>
            )}
            {bag.process && (
              <MetaRow label="Process">{formatEnumValue(bag.process)}</MetaRow>
            )}
            {bag.roast_level && (
              <MetaRow label="Roast Level">{formatEnumValue(bag.roast_level)}</MetaRow>
            )}
            {bag.roast_date && (
              <MetaRow label="Roast Date">
                {new Date(bag.roast_date).toLocaleDateString()}
              </MetaRow>
            )}
            {bag.altitude_masl && (
              <MetaRow label="Altitude">{bag.altitude_masl} masl</MetaRow>
            )}
            {bag.rating && (
              <MetaRow label="Rating">{bag.rating.toFixed(1)} / 10</MetaRow>
            )}
            {bag.varietal && bag.varietal.length > 0 && (
              <div className="col-span-2">
                <dt className="text-sm text-muted-foreground">Varietal</dt>
                <dd className="mt-1 flex flex-wrap gap-1">
                  {bag.varietal.map((v) => (
                    <Badge key={v} variant="outline">{v}</Badge>
                  ))}
                </dd>
              </div>
            )}
            {bag.flavor_notes.length > 0 && (
              <div className="col-span-2">
                <dt className="text-sm text-muted-foreground">Flavor Notes</dt>
                <dd className="mt-1 flex flex-wrap gap-1">
                  {bag.flavor_notes.map((note) => (
                    <Badge key={note} variant="outline">{note}</Badge>
                  ))}
                </dd>
              </div>
            )}
            {bag.notes && (
              <div className="col-span-2">
                <dt className="text-sm text-muted-foreground">Notes</dt>
                <dd className="mt-0.5 text-sm">{bag.notes}</dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      {/* Brew History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Brew History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No brews logged yet.</p>
        </CardContent>
      </Card>
    </div>
  )
}

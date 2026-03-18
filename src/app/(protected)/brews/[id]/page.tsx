import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BREW_METHOD_LABELS } from '@/lib/constants/methods'
import { deleteBrewAction } from '../actions'
import type { BrewSession } from '@/types'

type BrewWithBag = BrewSession & { bags: { id: string; name: string } }

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function formatEnum(value: string): string {
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

export default async function BrewDetailPage({
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

  const { data: brew, error } = await supabase
    .from('brew_sessions')
    .select('*, bags(id, name)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single<BrewWithBag>()

  if (error || !brew) {
    redirect('/brews')
  }

  const deleteWithId = deleteBrewAction.bind(null, brew.id)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">
            <Link href={`/bags/${brew.bags.id}`} className="hover:underline">
              {brew.bags.name}
            </Link>
          </h1>
          <p className="text-muted-foreground text-sm">
            {BREW_METHOD_LABELS[brew.method] ?? formatEnum(brew.method)}
            {' · '}
            {new Date(brew.brewed_at).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/brews/${brew.id}/edit`}>Edit</Link>
          </Button>
          <form action={deleteWithId}>
            <Button variant="destructive" size="sm" type="submit">
              Delete
            </Button>
          </form>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            <MetaRow label="Method">
              {BREW_METHOD_LABELS[brew.method] ?? formatEnum(brew.method)}
            </MetaRow>
            <MetaRow label="Date">
              {new Date(brew.brewed_at).toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </MetaRow>
            {brew.dose_grams != null && (
              <MetaRow label="Dose">{brew.dose_grams}g</MetaRow>
            )}
            {brew.out_grams != null && (
              <MetaRow label="Out">{brew.out_grams}g</MetaRow>
            )}
            {brew.water_grams != null && (
              <MetaRow label="Water">{brew.water_grams}g</MetaRow>
            )}
            {brew.brew_temp_c != null && (
              <MetaRow label="Temp">{brew.brew_temp_c}°C</MetaRow>
            )}
            {brew.brew_time_s != null && (
              <MetaRow label="Brew time">{formatTime(brew.brew_time_s)}</MetaRow>
            )}
            {brew.grind_size != null && (
              <MetaRow label="Grind size">{brew.grind_size}</MetaRow>
            )}
            {brew.rating != null && (
              <MetaRow label="Rating">{brew.rating} / 10</MetaRow>
            )}
          </dl>
        </CardContent>
      </Card>

      {brew.flavor_notes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Flavor notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {brew.flavor_notes.map((note) => (
                <span
                  key={note}
                  className="rounded-full border px-3 py-1 text-xs font-medium"
                >
                  {note}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {brew.notes != null && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{brew.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

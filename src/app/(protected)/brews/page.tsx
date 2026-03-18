import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { BREW_METHOD_LABELS } from '@/lib/constants/methods'
import type { BrewSession } from '@/types'

type BrewWithBag = BrewSession & { bags: { name: string } }

export default async function BrewsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const [{ data: brews, error }, { count: bagCount }] = await Promise.all([
    supabase
      .from('brew_sessions')
      .select('*, bags(name)')
      .eq('user_id', user.id)
      .order('brewed_at', { ascending: false }),
    supabase
      .from('bags')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id),
  ])

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <p className="text-destructive">Failed to load brews: {error.message}</p>
      </div>
    )
  }

  const hasBags = (bagCount ?? 0) > 0

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Brews</h1>
        {hasBags && (
          <Button asChild>
            <Link href="/brews/new">Log brew</Link>
          </Button>
        )}
      </div>

      {brews.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-20 text-center">
          {hasBags ? (
            <>
              <p className="text-lg font-medium">No brews logged yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Start tracking your brews to build your history.
              </p>
              <Button className="mt-4" asChild>
                <Link href="/brews/new">Log your first brew</Link>
              </Button>
            </>
          ) : (
            <>
              <p className="text-lg font-medium">No bags yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add a bag of coffee before logging a brew.
              </p>
              <Button className="mt-4" asChild>
                <Link href="/bags/new">Add a bag</Link>
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="divide-y rounded-lg border">
          {(brews as BrewWithBag[]).map((brew) => (
            <Link
              key={brew.id}
              href={`/brews/${brew.id}`}
              className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-muted/50 transition-colors"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{brew.bags.name}</p>
                <p className="text-sm text-muted-foreground">
                  {BREW_METHOD_LABELS[brew.method] ?? brew.method}
                  {' · '}
                  {new Date(brew.brewed_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-6 text-sm text-muted-foreground">
                {brew.dose_grams != null && brew.out_grams != null && (
                  <span>{brew.dose_grams}g / {brew.out_grams}g</span>
                )}
                {brew.rating != null && (
                  <span className="font-medium text-foreground">{brew.rating}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

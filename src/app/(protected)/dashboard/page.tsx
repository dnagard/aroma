import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BREW_METHOD_LABELS } from '@/lib/constants/methods'
import type { Bag, BrewSession } from '@/types'

type BrewWithBag = BrewSession & { bags: { name: string } }

function formatEnum(value: string): string {
  return value.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const [
    { count: bagCount, error: bagCountError },
    { count: brewCount, error: brewCountError },
    { data: recentBrews, error: brewsError },
    { data: recentBags, error: bagsError },
  ] = await Promise.all([
    supabase.from('bags').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('brew_sessions').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase
      .from('brew_sessions')
      .select('*, bags(name)')
      .eq('user_id', user.id)
      .order('brewed_at', { ascending: false })
      .limit(5),
    supabase
      .from('bags')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3),
  ])

  const fetchError = bagCountError || brewCountError || brewsError || bagsError

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {fetchError && (
        <p className="text-destructive">Failed to load dashboard: {fetchError.message}</p>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-3xl font-bold">{bagCount ?? 0}</p>
            <p className="text-sm text-muted-foreground">Bags</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-3xl font-bold">{brewCount ?? 0}</p>
            <p className="text-sm text-muted-foreground">Brews</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/bags/new">Add a bag</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/brews/new">Log a brew</Link>
        </Button>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent brews */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent brews</CardTitle>
            <Link href="/brews" className="text-sm text-muted-foreground hover:text-foreground">
              View all
            </Link>
          </CardHeader>
          <CardContent className="px-0 pb-2">
            {!recentBrews || recentBrews.length === 0 ? (
              <p className="px-4 text-sm text-muted-foreground">No brews yet</p>
            ) : (
              <ul>
                {(recentBrews as BrewWithBag[]).map((brew) => (
                  <li key={brew.id}>
                    <Link
                      href={`/brews/${brew.id}`}
                      className="flex items-center justify-between gap-4 px-4 py-2.5 hover:bg-muted/50 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-sm">{brew.bags.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {BREW_METHOD_LABELS[brew.method] ?? formatEnum(brew.method)}
                          {' · '}
                          {new Date(brew.brewed_at).toLocaleDateString()}
                        </p>
                      </div>
                      {brew.rating != null && (
                        <span className="shrink-0 text-sm font-medium">{brew.rating}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Recent bags */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent bags</CardTitle>
            <Link href="/bags" className="text-sm text-muted-foreground hover:text-foreground">
              View all
            </Link>
          </CardHeader>
          <CardContent className="px-0 pb-2">
            {!recentBags || recentBags.length === 0 ? (
              <p className="px-4 text-sm text-muted-foreground">No bags yet</p>
            ) : (
              <ul>
                {(recentBags as Bag[]).map((bag) => (
                  <li key={bag.id}>
                    <Link
                      href={`/bags/${bag.id}`}
                      className="flex items-center justify-between gap-4 px-4 py-2.5 hover:bg-muted/50 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-sm">{bag.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {[bag.origin_country, bag.roast_level ? formatEnum(bag.roast_level) : null]
                            .filter(Boolean)
                            .join(' · ') || <span className="italic">No details</span>}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

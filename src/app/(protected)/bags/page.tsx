import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { BagCard } from '@/components/bags/BagCard'
import type { Bag } from '@/types'

export default async function BagsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  console.log('user:', user?.id, 'session:', (await supabase.auth.getSession()).data.session?.access_token?.slice(0, 20))

  if (!user) {
    redirect('/auth/login')
  }

  const { data: bags, error } = await supabase
    .from('bags')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <p className="text-destructive">Failed to load bags: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Bags</h1>
        <Button asChild>
          <Link href="/bags/new">Add bag</Link>
        </Button>
      </div>

      {bags.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-20 text-center">
          <p className="text-lg font-medium">No bags yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add your first bag to start tracking your coffee.
          </p>
          <Button className="mt-4" asChild>
            <Link href="/bags/new">Add a bag</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(bags as Bag[]).map((bag) => (
            <BagCard key={bag.id} bag={bag} />
          ))}
        </div>
      )}
    </div>
  )
}

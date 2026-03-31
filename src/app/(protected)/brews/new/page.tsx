import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { NewBrewForm } from '@/components/brew/NewBrewForm'
import { createBrewAction } from '@/app/(protected)/brews/actions'

export default async function NewBrewPage({
  searchParams,
}: {
  searchParams: Promise<{ bag_id?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { bag_id } = await searchParams

  const { data: bags } = await supabase
    .from('bags')
    .select('id, name')
    .eq('user_id', user.id)
    .order('name', { ascending: true })

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Log a brew</h1>
      <NewBrewForm
        action={createBrewAction}
        bags={bags ?? []}
        defaultBagId={bag_id}
      />
    </div>
  )
}

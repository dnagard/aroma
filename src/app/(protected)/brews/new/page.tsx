import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { NewBrewForm } from '@/components/brew/NewBrewForm'
import { createBrewAction } from '@/app/(protected)/brews/actions'

export default async function NewBrewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: bags } = await supabase
    .from('bags')
    .select('id, name')
    .eq('user_id', user.id)
    .order('name', { ascending: true })

  const defaultBrewedAt = new Date().toISOString().slice(0, 16)

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Log a brew</h1>
      <NewBrewForm
        action={createBrewAction}
        bags={bags ?? []}
        defaultBrewedAt={defaultBrewedAt}
      />
    </div>
  )
}

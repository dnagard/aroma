import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EditBrewForm } from '@/components/brew/EditBrewForm'
import { updateBrewAction } from '@/app/(protected)/brews/actions'

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditBrewPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const [{ data: brew }, { data: bags }] = await Promise.all([
    supabase
      .from('brew_sessions')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single(),
    supabase
      .from('bags')
      .select('id, name')
      .eq('user_id', user.id)
      .order('name'),
  ])

  if (!brew) {
    redirect('/brews')
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Edit brew</h1>
      <EditBrewForm brew={brew} bags={bags ?? []} action={updateBrewAction} />
    </div>
  )
}

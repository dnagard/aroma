import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EditBagForm } from '@/components/bags/EditBagForm'
import { updateBagAction } from '@/app/(protected)/bags/actions'

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditBagPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: bag } = await supabase
    .from('bags')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!bag) {
    redirect('/bags')
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Edit bag</h1>
      <EditBagForm bag={bag} action={updateBagAction} />
    </div>
  )
}

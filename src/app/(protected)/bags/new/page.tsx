import { NewBagForm } from '@/components/bags/NewBagForm'
import { createBagAction } from '@/app/(protected)/bags/actions'

export default function NewBagPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Add a bag</h1>
      <NewBagForm action={createBagAction} />
    </div>
  )
}

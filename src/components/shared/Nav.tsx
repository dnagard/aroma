import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { UserMenu } from './UserMenu'
import { NavLinks } from './NavLinks'

export async function Nav() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <nav className="border-b bg-background">
      <div className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3">
        <Link href="/dashboard" className="text-sm font-semibold tracking-tight">
          Aroma
        </Link>
        <NavLinks />
        {user?.email && (
          <div className="ml-auto">
            <UserMenu email={user.email} />
          </div>
        )}
      </div>
    </nav>
  )
}

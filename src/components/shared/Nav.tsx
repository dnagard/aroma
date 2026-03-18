import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { UserMenu } from './UserMenu'

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/bags', label: 'Bags' },
  { href: '/brews', label: 'Brews' },
] as const

export async function Nav() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <nav className="border-b bg-background">
      <div className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3">
        <Link href="/dashboard" className="text-sm font-semibold tracking-tight">
          Aroma
        </Link>
        <div className="flex items-center gap-4">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </div>
        {user?.email && (
          <div className="ml-auto">
            <UserMenu email={user.email} />
          </div>
        )}
      </div>
    </nav>
  )
}

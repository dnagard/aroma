"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/bags', label: 'Bags' },
  { href: '/brews', label: 'Brews' },
] as const

export function NavLinks() {
  const pathname = usePathname()

  return (
    <div className="flex items-center">
      {NAV_LINKS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "text-sm font-medium px-3 py-1.5 rounded-full transition-colors",
            pathname === href || pathname.startsWith(href + '/')
              ? "bg-accent text-accent-foreground font-semibold"
              : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
          )}
        >
          {label}
        </Link>
      ))}
    </div>
  )
}

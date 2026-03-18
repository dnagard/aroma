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
    <div className="flex items-center gap-4">
      {NAV_LINKS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "text-sm transition-colors hover:text-foreground",
            pathname === href || pathname.startsWith(href + '/')
              ? "text-foreground font-medium"
              : "text-muted-foreground"
          )}
        >
          {label}
        </Link>
      ))}
    </div>
  )
}

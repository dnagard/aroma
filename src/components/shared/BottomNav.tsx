"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ShoppingBag, Coffee } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/bags", label: "Bags", icon: ShoppingBag },
  { href: "/brews", label: "Brews", icon: Coffee },
] as const

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="flex items-center h-16 px-2 gap-1">
        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/")
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-full transition-colors",
                isActive
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className={cn("text-[2.5vw] leading-none", isActive ? "font-semibold" : "font-medium")}>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

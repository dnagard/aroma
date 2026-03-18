"use client"

import { useEffect, useState } from "react"
import { Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const THEMES = [
  { id: "paper",            label: "Paper",            dark: false },
  { id: "light",            label: "Light",            dark: false },
  { id: "dark",             label: "Dark",             dark: true  },
  { id: "catppuccin-latte", label: "Catppuccin Latte", dark: false },
  { id: "catppuccin-mocha", label: "Catppuccin Mocha", dark: true  },
] as const

type ThemeId = (typeof THEMES)[number]["id"]

function applyTheme(themeId: ThemeId) {
  const html = document.documentElement
  const theme = THEMES.find(t => t.id === themeId) ?? THEMES[0]

  if (themeId === "paper") {
    html.removeAttribute("data-theme")
  } else {
    html.setAttribute("data-theme", themeId)
  }

  if (theme.dark) {
    html.classList.add("dark")
  } else {
    html.classList.remove("dark")
  }
}

export function ThemeSwitcher() {
  const [current, setCurrent] = useState<ThemeId>("paper")

  useEffect(() => {
    const saved = (localStorage.getItem("theme") ?? "paper") as ThemeId
    setCurrent(saved)
    applyTheme(saved)
  }, [])

  function handleSelect(themeId: ThemeId) {
    setCurrent(themeId)
    localStorage.setItem("theme", themeId)
    applyTheme(themeId)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Switch theme">
          <Palette className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {THEMES.map(theme => (
          <DropdownMenuItem
            key={theme.id}
            onSelect={() => handleSelect(theme.id)}
            data-active={current === theme.id}
            className="data-[active=true]:font-semibold"
          >
            {theme.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Nav } from "@/components/shared/Nav"
import { BottomNav } from "@/components/shared/BottomNav"

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="pb-16 md:pb-0">{children}</main>
      <BottomNav />
    </div>
  )
}

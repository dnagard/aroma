import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Nav } from "@/components/shared/Nav"

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main>{children}</main>
    </div>
  )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Aroma</h1>
        <p className="mt-2 text-muted-foreground">
          Coffee journaling for home brewers and roasters
        </p>
      </div>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/auth/login">Log in</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/auth/sign-up">Sign up</Link>
        </Button>
      </div>
    </main>
  )
}

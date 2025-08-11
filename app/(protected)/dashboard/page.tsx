import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/logout-button"; // <-- named import

export default async function DashboardPage() {
  // Server-side: create a fresh client for this request
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // user is guaranteed by the (protected)/layout.tsx guard,
  // but we’ll be defensive just in case:
  const email = user?.email ?? "unknown";

  return (
    <main className="max-w-3xl mx-auto p-6">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <LogoutButton />
      </header>

      <section className="space-y-2">
        <p className="text-sm opacity-70">
          Signed in as <span className="font-medium">{email}</span>
        </p>

        <div className="mt-6 grid gap-3">
          <Link href="/brews" className="underline">
            View your brews
          </Link>
          <Link href="/brews/new" className="underline">
            Add a new brew
          </Link>
        </div>
      </section>
    </main>
  );
}

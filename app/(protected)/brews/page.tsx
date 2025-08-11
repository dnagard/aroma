import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Brews • Aroma" };

type Brew = {
  id: number;
  created_at: string | null;
  method: string | null;
  temp: number | null;
  dose: number | null;
  yield: number | null;
  time: number | null;
  grind_size: number | null;
  result: string | null;
  bag_id: number | null;
};

export default async function BrewsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    // (protected)/layout already redirects, but keep this defensive branch
    return null;
  }

  // Fetch latest brews for this user
  const { data: brews, error } = await supabase
    .from("brews")
    .select(
      "id, created_at, method, temp, dose, yield, time, grind_size, result, bag_id"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(25);

  if (error) throw new Error(error.message);

  return (
    <main className="max-w-3xl mx-auto p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Your Brews</h1>
        <Link
          href="/brews/new"
          className="px-3 py-2 rounded bg-black text-white text-sm"
        >
          New Brew
        </Link>
      </header>

      {!brews || brews.length === 0 ? (
        <div className="border rounded p-6">
          <p className="mb-3">No brews yet.</p>
          <Link href="/brews/new" className="underline">
            Create your first brew →
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {brews.map((b: Brew) => (
            <li key={b.id} className="border rounded p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">
                  {b.method ?? "Unknown method"}
                  {b.result ? ` — ${b.result}` : ""}
                </div>
                <div className="text-xs opacity-60">
                  {b.created_at
                    ? new Date(b.created_at).toLocaleString()
                    : ""}
                </div>
              </div>

              <div className="text-sm opacity-80 mt-1">
                {fmt(b.dose)}g in → {fmt(b.yield)}g out
                {b.temp != null ? ` • ${fmt(b.temp)}°C` : ""}
                {b.time != null ? ` • ${fmt(b.time)}s` : ""}
                {b.grind_size != null ? ` • grind ${fmt(b.grind_size)}` : ""}
                {b.bag_id != null ? ` • bag #${b.bag_id}` : ""}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

function fmt(n: number | null) {
  if (n == null) return "—";
  // keep it light: drop trailing zeros
  const s = Number(n).toFixed(2);
  return s.replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}

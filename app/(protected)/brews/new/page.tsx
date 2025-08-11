import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "New Brew • Aroma" };

async function createBrew(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const toNum = (v: FormDataEntryValue | null) =>
    v === null || v === "" ? null : Number(v);

  const payload = {
    user_id: user.id,
    bag_id: toNum(formData.get("bag_id")),
    method: (formData.get("method") as string)?.trim() || null,
    temp: toNum(formData.get("temp")),
    dose: toNum(formData.get("dose")),
    yield: toNum(formData.get("yield")),
    time: toNum(formData.get("time")),
    grind_size: toNum(formData.get("grind_size")),
    result: (formData.get("result") as string)?.trim() || null,
    other: parseJsonSafely(formData.get("other") as string),
    // created_at will default to now() if your table default is set; otherwise you can set it here
  };

  const { error } = await supabase.from("brews").insert(payload);
  if (error) throw new Error(error.message);

  redirect("/brews");
}

export default function NewBrewPage() {
  return (
    <main className="max-w-xl mx-auto p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">New Brew</h1>
        <Link href="/brews" className="text-sm underline">
          Back to brews
        </Link>
      </header>

      <form action={createBrew} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input name="method" placeholder="Method (V60, Espresso…)" className="border p-2 rounded" />
          <input name="result" placeholder="Result (e.g., good, bitter…)" className="border p-2 rounded" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input name="dose" type="number" step="0.1" placeholder="Dose (g)" className="border p-2 rounded" />
          <input name="yield" type="number" step="0.1" placeholder="Yield (g)" className="border p-2 rounded" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <input name="temp" type="number" step="0.1" placeholder="Temp (°C)" className="border p-2 rounded" />
          <input name="time" type="number" step="0.1" placeholder="Time (s)" className="border p-2 rounded" />
          <input name="grind_size" type="number" step="0.1" placeholder="Grind size" className="border p-2 rounded" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input name="bag_id" type="number" placeholder="Bag ID (optional)" className="border p-2 rounded" />
          <textarea
            name="other"
            placeholder='Other (JSON, optional) e.g. {"turbulence": "low"}'
            className="border p-2 rounded"
            rows={3}
          />
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 rounded bg-black text-white">Save</button>
          <Link href="/brews" className="px-4 py-2 rounded border">
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}

function parseJsonSafely(text?: string | null) {
  if (!text) return null;
  try {
    const v = JSON.parse(text);
    return v && typeof v === "object" ? v : null;
  } catch {
    // If invalid JSON, store as null for now. (You can surface an error later)
    return null;
  }
}

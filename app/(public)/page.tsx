import AuthRedirect from "@/components/auth-redirect";

export const metadata = {
  title: "Aroma – Coffee Journaling",
  description: "Track brews, beans, and tasting notes. Learn better coffee.",
};

export default function PublicLanding() {
  return (
    <main className="min-h-screen">
      <AuthRedirect to="/dashboard" />
      <section className="mx-auto max-w-4xl p-6">
        <h1 className="text-4xl font-bold">Aroma</h1>
        <p className="mt-3 text-lg opacity-80">
          A fast, thoughtful coffee journal for dialing in better brews.
        </p>
        <div className="mt-6 flex gap-3">
          <a href="/auth/login" className="px-4 py-2 rounded bg-black text-white">Sign in</a>
          <a href="/learn" className="px-4 py-2 rounded border">Learn brewing</a>
        </div>
      </section>
    </main>
  );
}

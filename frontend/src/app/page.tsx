import Link from "next/link";

const highlights = [
  "Semantic search with natural-language queries",
  "Personalized user recommendations based on saved preferences",
  "Interaction-aware feed with clicks, ratings, and watch history"
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(249,115,22,0.14),_transparent_28%),linear-gradient(180deg,_#020617,_#0f172a_46%,_#111827)] text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-12 px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-6">
          <span className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.28em] text-cyan-100">
            Movie Recommender
          </span>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
              Discover movies with a lightweight feed built around your taste.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-300">
              Sign up with your favorite genres, search in natural language, and let the recommendation feed improve as users click, rate, and track what they have watched.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-cyan-300 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
            >
              Create account
            </Link>
            <Link
              href="/signin"
              className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/8 px-5 text-sm font-semibold text-white transition hover:bg-white/12"
            >
              Sign in
            </Link>
            <Link
              href="/feed"
              className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/50 px-5 text-sm font-semibold text-slate-200 transition hover:bg-slate-950/80"
            >
              Open feed
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {highlights.map((highlight) => (
            <article
              key={highlight}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-sm leading-6 text-slate-300 backdrop-blur"
            >
              {highlight}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

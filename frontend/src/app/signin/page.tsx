"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { signinUser } from "@/lib/api";
import { saveUserSession } from "@/lib/session";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const user = await signinUser({ email, password });
      saveUserSession(user);
      router.push("/feed");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#020617,_#0f172a_45%,_#111827)] px-4 py-10 text-white sm:px-6">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center">
        <div className="w-full rounded-[2rem] border border-white/10 bg-white/6 p-6 backdrop-blur sm:p-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold">Sign in</h1>
            <p className="text-sm text-slate-400">
              Access your personalized movie feed and recommendation history.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block space-y-2 text-sm text-slate-300">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="min-h-12 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 text-white outline-none transition focus:border-cyan-300"
                required
              />
            </label>

            <label className="block space-y-2 text-sm text-slate-300">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="min-h-12 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 text-white outline-none transition focus:border-cyan-300"
                required
              />
            </label>

            {error ? <p className="text-sm text-amber-300">{error}</p> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-12 w-full rounded-2xl bg-cyan-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-cyan-300/60"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-400">
            New here?{" "}
            <Link href="/signup" className="text-cyan-200 underline decoration-white/10 underline-offset-4">
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

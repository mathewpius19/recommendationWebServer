"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { GenrePicker } from "@/components/GenrePicker";
import { GENRE_OPTIONS } from "@/lib/constants";
import { signupUser } from "@/lib/api";
import { saveUserSession } from "@/lib/session";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>(GENRE_OPTIONS.slice(0, 3));
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (selectedGenres.length === 0) {
      setError("Choose at least one genre preference.");
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await signupUser({
        email,
        password,
        userName,
        genrePref: selectedGenres.join(", ")
      });
      saveUserSession(user);
      router.push("/feed");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to create your account.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#020617,_#0f172a_45%,_#111827)] px-4 py-10 text-white sm:px-6">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl items-center">
        <div className="w-full rounded-[2rem] border border-white/10 bg-white/6 p-6 backdrop-blur sm:p-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold">Create your profile</h1>
            <p className="text-sm text-slate-400">
              We will save these preferences with your account and use them for recommendation generation.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-2 text-sm text-slate-300">
                <span>Username</span>
                <input
                  value={userName}
                  onChange={(event) => setUserName(event.target.value)}
                  className="min-h-12 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 text-white outline-none transition focus:border-cyan-300"
                  required
                />
              </label>

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
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
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

              <label className="block space-y-2 text-sm text-slate-300">
                <span>Confirm password</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="min-h-12 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 text-white outline-none transition focus:border-cyan-300"
                  required
                />
              </label>
            </div>

            <div className="space-y-3">
              <div>
                <h2 className="text-sm font-medium text-white">Genre preferences</h2>
                <p className="text-sm text-slate-400">
                  Select the genres you want your recommendations to lean toward.
                </p>
              </div>
              <GenrePicker selectedGenres={selectedGenres} onChange={setSelectedGenres} />
            </div>

            {error ? <p className="text-sm text-amber-300">{error}</p> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-12 w-full rounded-2xl bg-cyan-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-cyan-300/60"
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/signin" className="text-cyan-200 underline decoration-white/10 underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

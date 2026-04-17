"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";

import { InteractionPanel } from "@/components/InteractionPanel";
import { MovieGrid } from "@/components/MovieGrid";
import { SearchBar } from "@/components/SearchBar";
import {
  getInteractions,
  getMovies,
  getRecommendations,
  saveInteraction,
  searchMovies
} from "@/lib/api";
import { clearUserSession, getUserSession } from "@/lib/session";
import { Interaction, InteractionInput, Movie, User } from "@/lib/types";

export default function FeedPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [library, setLibrary] = useState<Movie[]>([]);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [queryResults, setQueryResults] = useState<Movie[]>([]);
  const [interactions, setInteractions] = useState<Record<number, Interaction>>({});
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState("");
  const [feedError, setFeedError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);
  const [isSavingInteraction, setIsSavingInteraction] = useState(false);

  useEffect(() => {
    const storedUser = getUserSession();

    if (!storedUser) {
      router.replace("/signin");
      return;
    }

    setUser(storedUser);
  }, [router]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const activeUser = user;

    async function loadFeed() {
      setIsLoadingFeed(true);
      setFeedError("");

      try {
        const [recommendationData, libraryData, interactionData] = await Promise.all([
          getRecommendations(activeUser.id),
          getMovies(),
          getInteractions(activeUser.id)
        ]);

        setRecommendations(recommendationData);
        setLibrary(libraryData);
        setInteractions(
          interactionData.reduce<Record<number, Interaction>>((accumulator, interaction) => {
            accumulator[interaction.movieId] = interaction;
            return accumulator;
          }, {})
        );
      } catch (loadError) {
        setFeedError(loadError instanceof Error ? loadError.message : "Unable to load your feed.");
      } finally {
        setIsLoadingFeed(false);
      }
    }

    void loadFeed();
  }, [user]);

  async function handleSearch(query: string) {
    setIsSearching(true);
    setSearchError("");
    setSearchQuery(query);

    try {
      const data = await searchMovies(query);
      startTransition(() => {
        setQueryResults(data);
      });
    } catch (loadError) {
      setSearchError(loadError instanceof Error ? loadError.message : "Unable to search movies.");
      setQueryResults([]);
    } finally {
      setIsSearching(false);
    }
  }

  async function persistInteraction(movie: Movie, updates: Partial<InteractionInput>) {
    if (!user) {
      return;
    }

    const current = interactions[movie.movieId];
    const payload: InteractionInput = {
      userId: user.id,
      movieId: movie.movieId,
      rating: updates.rating ?? current?.rating ?? 0,
      clicks: updates.clicks ?? current?.clicks ?? 0,
      watched: updates.watched ?? current?.watched ?? false,
      lastInteraction: new Date().toISOString().slice(0, 19)
    };

    setIsSavingInteraction(true);

    try {
      const saved = await saveInteraction(payload);
      setInteractions((currentInteractions) => ({
        ...currentInteractions,
        [saved.movieId]: saved
      }));
    } catch (saveError) {
      setFeedError(saveError instanceof Error ? saveError.message : "Unable to save interaction.");
    } finally {
      setIsSavingInteraction(false);
    }
  }

  async function handleMovieOpen(movie: Movie) {
    setSelectedMovie(movie);
    const current = interactions[movie.movieId];

    await persistInteraction(movie, {
      clicks: (current?.clicks ?? 0) + 1
    });
  }

  function handleSignOut() {
    clearUserSession();
    router.push("/signin");
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),_transparent_20%),radial-gradient(circle_at_right,_rgba(249,115,22,0.12),_transparent_24%),linear-gradient(180deg,_#020617,_#0f172a_46%,_#111827)] text-white">
      <section className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.25em] text-cyan-100">
              <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1">
                Personal feed
              </span>
              <span className="text-slate-400">Signed in as {user.userName}</span>
            </div>
            <div>
              <h1 className="text-3xl font-semibold sm:text-4xl">Welcome back, {user.userName}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                Your recommendations use saved genre preferences: {user.genrePref || "No preferences saved"}.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/8 px-4 text-sm font-medium text-white transition hover:bg-white/12"
            >
              Home
            </Link>
            <button
              type="button"
              onClick={async () => {
                if (user) {
                  setIsLoadingFeed(true);
                  setFeedError("");
                  try {
                    const data = await getRecommendations(user.id);
                    setRecommendations(data);
                  } catch (loadError) {
                    setFeedError(loadError instanceof Error ? loadError.message : "Unable to refresh recommendations.");
                  } finally {
                    setIsLoadingFeed(false);
                  }
                }
              }}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-sm font-medium text-slate-200 transition hover:bg-slate-950"
            >
              Refresh recommendations
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-cyan-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
            >
              Sign out
            </button>
          </div>
        </header>

        <SearchBar isLoading={isSearching} onSearch={handleSearch} />

        {feedError ? <p className="text-sm text-amber-300">{feedError}</p> : null}

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Recommendations for you</h2>
            <p className="text-sm text-slate-400">
              Generated using your saved preferences and recorded interactions.
            </p>
          </div>
          {isLoadingFeed ? (
            <SkeletonGrid />
          ) : recommendations.length > 0 ? (
            <MovieGrid movies={recommendations} interactions={interactions} onSelect={handleMovieOpen} />
          ) : (
            <EmptyState message="Recommendations will show up here once the backend returns them." />
          )}
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Semantic search</h2>
            <p className="text-sm text-slate-400">
              {searchQuery ? `Showing results for "${searchQuery}".` : "Use natural-language search to discover something new."}
            </p>
          </div>
          {searchError ? <p className="text-sm text-amber-300">{searchError}</p> : null}
          {isSearching ? (
            <SkeletonGrid />
          ) : queryResults.length > 0 ? (
            <MovieGrid movies={queryResults} interactions={interactions} onSelect={handleMovieOpen} />
          ) : (
            <EmptyState message="Search results will appear here after you submit a query." />
          )}
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Browse library</h2>
            <p className="text-sm text-slate-400">
              Click any movie to record engagement, rate it, or mark it as watched.
            </p>
          </div>
          {isLoadingFeed ? (
            <SkeletonGrid />
          ) : library.length > 0 ? (
            <MovieGrid movies={library.slice(0, 24)} interactions={interactions} onSelect={handleMovieOpen} />
          ) : (
            <EmptyState message="No movies are available in the library yet." />
          )}
        </section>
      </section>

      <InteractionPanel
        movie={selectedMovie}
        interaction={selectedMovie ? interactions[selectedMovie.movieId] : null}
        isSaving={isSavingInteraction}
        onClose={() => setSelectedMovie(null)}
        onRate={(rating) => {
          if (selectedMovie) {
            void persistInteraction(selectedMovie, { rating });
          }
        }}
        onToggleWatched={(watched) => {
          if (selectedMovie) {
            void persistInteraction(selectedMovie, { watched });
          }
        }}
      />
    </main>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="aspect-[2/3] animate-pulse rounded-3xl border border-white/8 bg-white/5"
        />
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/40 px-6 py-12 text-center text-sm text-slate-400">
      {message}
    </div>
  );
}

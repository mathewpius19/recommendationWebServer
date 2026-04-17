import Image from "next/image";

import { Interaction, Movie } from "@/lib/types";

type MovieCardProps = {
  movie: Movie;
  interaction?: Interaction;
  onOpen?: (movie: Movie) => void;
};

export function MovieCard({ movie, interaction, onOpen }: MovieCardProps) {
  const hasPoster = Boolean(movie.posterUrl);

  return (
    <article
      className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/60 hover:bg-slate-900"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-slate-800">
        <button type="button" onClick={() => onOpen?.(movie)} className="block h-full w-full text-left">
          {hasPoster ? (
            <Image
              src={movie.posterUrl ?? ""}
              alt={movie.title}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 16vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(103,232,249,0.18),_transparent_55%),linear-gradient(180deg,_#0f172a,_#020617)] px-6 text-center text-sm text-slate-300">
              Poster unavailable
            </div>
          )}
        </button>
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="line-clamp-2 text-sm font-semibold text-white">{movie.title}</h3>
          <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-slate-300">
            #{movie.movieId}
          </span>
        </div>
        <p className="line-clamp-2 text-sm text-slate-400">{movie.genres || "Genres unavailable"}</p>
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-slate-300">
            {interaction?.clicks ?? 0} clicks
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-slate-300">
            {interaction?.rating ?? 0}/5 rating
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-slate-300">
            {interaction?.watched ? "Watched" : "Unwatched"}
          </span>
        </div>
      </div>
    </article>
  );
}

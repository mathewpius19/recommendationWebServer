import { Interaction, Movie } from "@/lib/types";

type InteractionPanelProps = {
  movie: Movie | null;
  interaction: Interaction | null;
  isSaving: boolean;
  onClose: () => void;
  onRate: (rating: number) => void;
  onToggleWatched: (watched: boolean) => void;
};

const ratingOptions = [1, 2, 3, 4, 5];

export function InteractionPanel({
  movie,
  interaction,
  isSaving,
  onClose,
  onRate,
  onToggleWatched
}: InteractionPanelProps) {
  if (!movie) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-20 flex items-end justify-end bg-slate-950/60 p-4 backdrop-blur-sm">
      <aside className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-950/95 p-6 text-white shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">{movie.title}</h2>
            <p className="mt-1 text-sm text-slate-400">{movie.genres || "Genres unavailable"}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-300 transition hover:bg-white/8"
          >
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Stat label="Clicks" value={String(interaction?.clicks ?? 0)} />
          <Stat label="Rating" value={`${interaction?.rating ?? 0}/5`} />
          <Stat label="Watched" value={interaction?.watched ? "Yes" : "No"} />
        </div>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-white">Rate this movie</h3>
            <div className="flex flex-wrap gap-2">
              {ratingOptions.map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => onRate(rating)}
                  disabled={isSaving}
                  className={`rounded-2xl border px-4 py-2 text-sm transition ${
                    interaction?.rating === rating
                      ? "border-cyan-300 bg-cyan-300/12 text-cyan-100"
                      : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-white">Watch status</h3>
            <button
              type="button"
              onClick={() => onToggleWatched(!(interaction?.watched ?? false))}
              disabled={isSaving}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:bg-white/10"
            >
              Mark as {interaction?.watched ? "unwatched" : "watched"}
            </button>
          </div>

          {interaction?.lastInteraction ? (
            <p className="text-sm text-slate-400">Last interaction: {interaction.lastInteraction}</p>
          ) : null}
        </div>
      </aside>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

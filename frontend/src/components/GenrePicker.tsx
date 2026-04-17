import { GENRE_OPTIONS } from "@/lib/constants";

type GenrePickerProps = {
  selectedGenres: string[];
  onChange: (genres: string[]) => void;
};

export function GenrePicker({ selectedGenres, onChange }: GenrePickerProps) {
  function toggleGenre(genre: string) {
    if (selectedGenres.includes(genre)) {
      onChange(selectedGenres.filter((entry) => entry !== genre));
      return;
    }

    onChange([...selectedGenres, genre]);
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {GENRE_OPTIONS.map((genre) => {
        const selected = selectedGenres.includes(genre);

        return (
          <button
            key={genre}
            type="button"
            onClick={() => toggleGenre(genre)}
            className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
              selected
                ? "border-cyan-300 bg-cyan-300/12 text-cyan-100"
                : "border-white/10 bg-slate-950/50 text-slate-300 hover:bg-slate-950"
            }`}
          >
            {genre}
          </button>
        );
      })}
    </div>
  );
}

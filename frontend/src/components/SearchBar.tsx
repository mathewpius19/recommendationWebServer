"use client";

import { FormEvent, useState } from "react";

type SearchBarProps = {
  isLoading: boolean;
  initialValue?: string;
  onSearch: (query: string) => Promise<void> | void;
};

export function SearchBar({ isLoading, initialValue = "", onSearch }: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    void onSearch(trimmedQuery);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-3 rounded-3xl border border-white/12 bg-white/8 p-3 shadow-[0_20px_80px_rgba(15,23,42,0.25)] backdrop-blur md:flex-row"
    >
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search with natural language, like 'movies like interstellar'"
        className="min-h-14 flex-1 rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-cyan-300"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="min-h-14 rounded-2xl bg-cyan-300 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-cyan-300/60"
      >
        {isLoading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}

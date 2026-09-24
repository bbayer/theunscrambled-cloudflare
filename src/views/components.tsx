import type { FC } from "hono/jsx";

export const SearchBar: FC<{ defaultWord?: string; actionType?: "unscramble" | "anagram" }> = ({
  defaultWord = "",
  actionType = "unscramble",
}) => {
  return (
    <div class="w-full max-w-2xl mx-auto">
      <form
        method="get"
        action="/search"
        onsubmit="event.preventDefault(); const w = this.word.value.trim().toLowerCase().replace(/[^a-z]/g, ''); if(w) { const mode = this.mode.value; window.location.href = mode === 'anagram' ? '/anagram-of-' + w : '/unscramble-' + w; }"
        class="bg-white p-2 rounded-2xl shadow-sm border border-slate-200/90 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 transition"
      >
        <div class="flex flex-col sm:flex-row gap-2 items-center">
          <div class="relative flex-1 w-full">
            <input
              type="text"
              name="word"
              value={defaultWord}
              placeholder="Enter your letters or word (e.g. plane, word, rstla)..."
              required
              autocomplete="off"
              autofocus
              class="w-full px-4 py-3 text-lg font-semibold tracking-wide placeholder:font-normal placeholder:text-slate-400 focus:outline-none uppercase bg-transparent"
            />
          </div>

          <div class="flex items-center gap-2 w-full sm:w-auto px-2">
            <select
              name="mode"
              class="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none"
            >
              <option value="unscramble" selected={actionType === "unscramble"}>
                Unscramble (All words)
              </option>
              <option value="anagram" selected={actionType === "anagram"}>
                Exact Anagrams
              </option>
            </select>

            <button
              type="submit"
              class="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/20 active:scale-95 transition"
            >
              Solve
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export const WordCard: FC<{ word: string; score: number; length?: number }> = ({
  word,
  score,
}) => {
  return (
    <a
      href={`/unscramble-${word}`}
      class="group flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-500 hover:shadow-md transition"
    >
      <span class="font-bold text-slate-800 tracking-wide uppercase group-hover:text-emerald-700 transition">
        {word}
      </span>
      <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
        {score} pts
      </span>
    </a>
  );
};

export const Pagination: FC<{
  current: number;
  total: number;
  basePath: string;
}> = ({ current, total, basePath }) => {
  if (total <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(1, current - 2);
  const end = Math.min(total, current + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  const getUrl = (p: number) => {
    if (p === 1) return basePath;
    return `${basePath}/${p}`;
  };

  return (
    <div class="flex items-center justify-center gap-1.5 mt-8">
      {current > 1 && (
        <a
          href={getUrl(current - 1)}
          class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
        >
          Previous
        </a>
      )}

      {pages.map((p) => (
        <a
          href={getUrl(p)}
          class={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            p === current
              ? "bg-emerald-600 text-white shadow-xs"
              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          {p}
        </a>
      ))}

      {current < total && (
        <a
          href={getUrl(current + 1)}
          class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
        >
          Next
        </a>
      )}
    </div>
  );
};

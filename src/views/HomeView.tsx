import type { FC } from "hono/jsx";
import { Layout } from "./Layout";
import { SearchBar } from "./components";

export const HomeView: FC = () => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
  const lengths = [2, 3, 4, 5, 6, 7, 8, 9, 10];
  const popularUnscrambles = [
    "plane", "apple", "crane", "table", "slate",
    "admirer", "listen", "silence", "garden", "master"
  ];

  return (
    <Layout
      title="The Unscrambled - Word Unscrambler, Anagram Solver & Scrabble Word Finder"
      description="Unscramble letters, find valid anagrams, and generate high scoring words for Scrabble, Words with Friends, Wordscapes, and Jumble."
    >
      <div class="space-y-12">
        {/* Hero Section */}
        <section class="text-center py-10 sm:py-16 space-y-6">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Cloudflare D1 Ultra-Fast Word Engine
          </div>

          <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900">
            Unscramble Letters & Find Words
          </h1>

          <p class="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Enter your scrambled letters below to uncover every hidden word, sorted by length and Scrabble point value.
          </p>

          <div class="pt-2">
            <SearchBar />
          </div>

          {/* Quick suggestions */}
          <div class="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-slate-500">
            <span>Popular:</span>
            {popularUnscrambles.map((w) => (
              <a
                href={`/unscramble-${w}`}
                class="px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 font-medium transition"
              >
                {w}
              </a>
            ))}
          </div>
        </section>

        {/* Feature Grid / Alt Sayfalar Hub */}
        <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
              🔠
            </div>
            <h3 class="text-lg font-bold text-slate-900">Words by Length</h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Explore exhaustive dictionaries organized by exact word lengths from 2-letter combos to 15-letter master words.
            </p>
            <div class="flex flex-wrap gap-1.5 pt-2">
              {lengths.map((len) => (
                <a
                  href={`/${len}-letter-words`}
                  class="px-2 py-1 rounded-md bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 text-xs font-semibold transition"
                >
                  {len}-letter
                </a>
              ))}
            </div>
          </div>

          <div class="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
              🔤
            </div>
            <h3 class="text-lg font-bold text-slate-900">Browse by Starting Letter</h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Target high-value letters like Q, X, Z, and J or browse standard vocabulary from A to Z with full pagination.
            </p>
            <div class="flex flex-wrap gap-1 pt-2">
              {alphabet.map((letter) => (
                <a
                  href={`/${letter}-words`}
                  class="w-7 h-7 flex items-center justify-center rounded bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-xs font-bold uppercase transition"
                >
                  {letter}
                </a>
              ))}
            </div>
          </div>

          <div class="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg">
              🧩
            </div>
            <h3 class="text-lg font-bold text-slate-900">Prefix & Suffix Solvers</h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Looking for words starting with a prefix or ending in common suffixes? Perfect for crossword clues and board games.
            </p>
            <div class="flex flex-wrap gap-1.5 pt-2">
              <a href="/words-starting-with-un" class="px-2.5 py-1 rounded-md bg-slate-50 hover:bg-purple-50 hover:text-purple-700 border border-slate-200 text-xs font-semibold transition">Start with UN-</a>
              <a href="/words-starting-with-re" class="px-2.5 py-1 rounded-md bg-slate-50 hover:bg-purple-50 hover:text-purple-700 border border-slate-200 text-xs font-semibold transition">Start with RE-</a>
              <a href="/words-ending-in-ing" class="px-2.5 py-1 rounded-md bg-slate-50 hover:bg-purple-50 hover:text-purple-700 border border-slate-200 text-xs font-semibold transition">End in -ING</a>
              <a href="/words-ending-in-ed" class="px-2.5 py-1 rounded-md bg-slate-50 hover:bg-purple-50 hover:text-purple-700 border border-slate-200 text-xs font-semibold transition">End in -ED</a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

import type { FC } from "hono/jsx";
import { Layout } from "./Layout";
import { SearchBar, WordCard, WordDefinitions } from "./components";
import type { UnscrambleResponse, WordDefinition } from "../lib/db";

export const UnscrambleView: FC<{
  data: UnscrambleResponse;
  definitions?: WordDefinition[];
}> = ({ data, definitions = [] }) => {
  const { rack, totalWords, wordsByLength, availableLengths } = data;
  const upperRack = rack.toUpperCase();

  return (
    <Layout
      title={`Unscramble ${upperRack} - Words Made with ${upperRack} | The Unscrambled`}
      description={`Unscramble letters in "${upperRack}". Found ${totalWords} valid words that can be made by unscrambling ${upperRack} with Scrabble point scores.`}
      canonicalUrl={`https://theunscrambled.com/unscramble-${rack}`}
    >
      <div class="space-y-10">
        {/* Header & Search */}
        <section class="text-center space-y-4 pt-4">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {totalWords} Words Found
          </div>

          <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            Unscramble <span class="text-emerald-600 uppercase">"{upperRack}"</span>
          </h1>

          <p class="text-slate-600 max-w-xl mx-auto text-sm sm:text-base">
            Below are all valid anagrams and sub-words made from the letters in <strong>{upperRack}</strong>, sorted by length and Scrabble points.
          </p>

          <div class="pt-2">
            <SearchBar defaultWord={rack} actionType="unscramble" />
          </div>
        </section>

        {/* Word Definitions Section (if any found) */}
        {definitions.length > 0 && (
          <div class="max-w-4xl mx-auto">
            <WordDefinitions word={rack} definitions={definitions} />
          </div>
        )}

        {/* Quick Jump Navigation for Lengths */}
        {availableLengths.length > 0 && (
          <div class="flex items-center justify-center flex-wrap gap-2 py-3 border-y border-slate-200/80">
            <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-2">
              Jump to:
            </span>
            {availableLengths.map((len) => (
              <a
                href={`#length-${len}`}
                class="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:border-emerald-500 hover:text-emerald-700 transition"
              >
                {len} Letters ({wordsByLength[len].length})
              </a>
            ))}
            <a
              href={`/anagram-of-${rack}`}
              class="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition"
            >
              Exact Anagrams Only &rarr;
            </a>
          </div>
        )}

        {/* Word Length Sections */}
        {totalWords === 0 ? (
          <div class="p-12 text-center rounded-2xl bg-white border border-slate-200/80 space-y-3">
            <p class="text-lg font-bold text-slate-700">No words found for "{upperRack}"</p>
            <p class="text-sm text-slate-500">
              Try adding more vowels or checking your spelling.
            </p>
          </div>
        ) : (
          <div class="space-y-10">
            {availableLengths.map((len) => {
              const words = wordsByLength[len];
              return (
                <section id={`length-${len}`} class="space-y-4 scroll-mt-24">
                  <div class="flex items-center justify-between pb-2 border-b border-slate-200">
                    <h2 class="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                      <span>{len}-Letter Words</span>
                      <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {words.length}
                      </span>
                    </h2>
                  </div>

                  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {words.map((item) => (
                      <WordCard word={item.word} score={item.score} length={item.length} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

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

        {/* Detailed SEO Information & Letter Analysis Section */}
        <section class="mt-16 pt-10 border-t border-slate-200/80 space-y-8">
          <div class="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900">
              Words That Can Be Made From "{upperRack}"
            </h2>
            <p class="text-sm sm:text-base text-slate-600 leading-relaxed">
              Unscrambling the letters <strong>{upperRack.split("").join(" ")}</strong> produced <strong>{totalWords}</strong> valid words in our official English lexicon. Whether you are playing Scrabble, Words with Friends, Wordfeud, or solving newspaper word puzzles like the Daily Jumble, these results give you every possible combination sorted by length and point value.
            </p>
            {availableLengths.length > 0 && (
              <p class="text-sm text-slate-600 leading-relaxed">
                The longest words you can make with these letters are <strong>{availableLengths[0]}-letter words</strong>, which can yield up to <strong>{wordsByLength[availableLengths[0]][0]?.score || 0}</strong> Scrabble points before board bonuses.
              </p>
            )}
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <h3 class="text-base font-bold text-slate-900">
                Word Breakdown for Letters {upperRack}
              </h3>
              <ul class="text-xs sm:text-sm text-slate-600 space-y-1.5 list-disc list-inside">
                {availableLengths.map((len) => (
                  <li>
                    <strong>{wordsByLength[len].length}</strong> {len}-letter word{wordsByLength[len].length === 1 ? "" : "s"}
                  </li>
                ))}
              </ul>
              <div class="pt-2">
                <a
                  href={`/anagram-of-${rack}`}
                  class="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  View only exact full-length anagrams of {upperRack} &rarr;
                </a>
              </div>
            </div>

            <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <h3 class="text-base font-bold text-slate-900">
                Word Game Tips for {upperRack}
              </h3>
              <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
                In Scrabble® and Words with Friends®, playing shorter 2-letter or 3-letter hook words parallel to an existing word can often score more than playing a single long word without bonus multipliers. Look through the {availableLengths[availableLengths.length - 1] || 2}-letter and 3-letter sections above for quick hooks!
              </p>
              {rack.length >= 2 && (
                <div class="pt-2 flex flex-wrap gap-2 text-xs">
                  <a
                    href={`/words-starting-with-${rack.slice(0, 2)}`}
                    class="px-2.5 py-1 rounded bg-slate-50 border border-slate-200 hover:border-emerald-500 font-medium text-slate-700"
                  >
                    Words starting with {rack.slice(0, 2).toUpperCase()}
                  </a>
                  <a
                    href={`/words-ending-in-${rack.slice(-2)}`}
                    class="px-2.5 py-1 rounded bg-slate-50 border border-slate-200 hover:border-emerald-500 font-medium text-slate-700"
                  >
                    Words ending with {rack.slice(-2).toUpperCase()}
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

import type { FC } from "hono/jsx";
import { Layout } from "./Layout";
import { SearchBar, WordCard, WordDefinitions } from "./components";
import type { WordResult, WordDefinition } from "../lib/db";

export const AnagramView: FC<{
  word: string;
  anagrams: WordResult[];
  definitions?: WordDefinition[];
}> = ({ word, anagrams, definitions = [] }) => {
  const upperWord = word.toUpperCase();

  return (
    <Layout
      title={`Anagrams of ${upperWord} - Anagram Solver | The Unscrambled`}
      description={`Find all exact anagrams formed by rearranging the letters in "${upperWord}". Full Scrabble word point values included.`}
      canonicalUrl={`https://theunscrambled.com/anagram-of-${word}`}
    >
      <div class="space-y-10">
        <section class="text-center space-y-4 pt-4">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {anagrams.length} Exact Anagram{anagrams.length === 1 ? "" : "s"}
          </div>

          <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            Anagrams of <span class="text-emerald-600 uppercase">"{upperWord}"</span>
          </h1>

          <p class="text-slate-600 max-w-xl mx-auto text-sm sm:text-base">
            Words that have the exact same letters and length as <strong>{upperWord}</strong>.
          </p>

          <div class="pt-2">
            <SearchBar defaultWord={word} actionType="anagram" />
          </div>
        </section>

        {/* Word Definitions */}
        {definitions.length > 0 && (
          <div class="max-w-3xl mx-auto">
            <WordDefinitions word={word} definitions={definitions} />
          </div>
        )}

        <div class="flex items-center justify-center gap-4 py-2">
          <a
            href={`/unscramble-${word}`}
            class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-semibold text-xs text-slate-700 transition"
          >
            &larr; View all sub-words (Unscramble {upperWord})
          </a>
        </div>

        {anagrams.length === 0 ? (
          <div class="p-12 text-center rounded-2xl bg-white border border-slate-200/80 space-y-3">
            <p class="text-lg font-bold text-slate-700">No exact anagrams found for "{upperWord}"</p>
            <p class="text-sm text-slate-500">
              You can still discover smaller words by unscrambling these letters:
            </p>
            <a
              href={`/unscramble-${word}`}
              class="inline-block mt-2 px-5 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition"
            >
              Unscramble {upperWord}
            </a>
          </div>
        ) : (
          <div class="max-w-3xl mx-auto">
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {anagrams.map((item) => (
                <WordCard word={item.word} score={item.score} length={item.length} />
              ))}
            </div>
          </div>
        )}

        {/* Detailed SEO Information & Anagram Analysis */}
        <section class="mt-16 pt-10 border-t border-slate-200/80 space-y-8">
          <div class="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900">
              About Anagrams of "{upperWord}"
            </h2>
            <p class="text-sm sm:text-base text-slate-600 leading-relaxed">
              An anagram of <strong>{upperWord}</strong> is formed by taking its {word.length} letters ({upperWord.split("").join(", ")}) and rearranging them to make a new, distinct English word. All {word.length} letters must be used exactly once without omitting or adding any letters.
            </p>
            <p class="text-sm sm:text-base text-slate-600 leading-relaxed">
              {anagrams.length > 0 ? (
                <span>
                  Our dictionary found <strong>{anagrams.length}</strong> exact {word.length}-letter anagram{anagrams.length === 1 ? "" : "s"} for <strong>{upperWord}</strong>. Each anagram is scored according to standard Scrabble® tile values.
                </span>
              ) : (
                <span>
                  There are no exact dictionary anagrams that use all {word.length} letters of <strong>{upperWord}</strong>. However, you can still form numerous smaller words using subsets of these letters!
                </span>
              )}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <h3 class="text-base font-bold text-slate-900">
                Letter & Word Characteristics
              </h3>
              <ul class="text-xs sm:text-sm text-slate-600 space-y-2">
                <li>
                  <strong class="text-slate-800">Word Length:</strong> {word.length} letters
                </li>
                <li>
                  <strong class="text-slate-800">Starting Letter:</strong> {word[0].toUpperCase()} (<a href={`/${word[0].toLowerCase()}-words`} class="text-emerald-700 hover:underline">browse words starting with {word[0].toUpperCase()}</a>)
                </li>
                <li>
                  <strong class="text-slate-800">Ending Letter:</strong> {word[word.length - 1].toUpperCase()}
                </li>
                {word.length >= 2 && (
                  <li>
                    <strong class="text-slate-800">Prefix / Suffix:</strong> Starts with <em>{word.slice(0, 2).toUpperCase()}</em>, ends with <em>{word.slice(-2).toUpperCase()}</em>
                  </li>
                )}
              </ul>
            </div>

            <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <h3 class="text-base font-bold text-slate-900">
                Need More Options?
              </h3>
              <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
                If you are playing Scrabble, Words with Friends, or Wordfeud and cannot fit the full {word.length}-letter word on the board, try our full word unscrambler to view all smaller 2, 3, 4, and 5-letter combinations:
              </p>
              <div class="pt-1">
                <a
                  href={`/unscramble-${word}`}
                  class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition"
                >
                  Unscramble all sub-words from {upperWord} &rarr;
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export const AnagramSolverLandingView: FC = () => {
  return (
    <Layout
      title="Anagram Solver - Find Anagrams for Any Word or Letters | The Unscrambled"
      description="Use our free and fast Anagram Solver tool. Unpack hidden words and unscramble anagrams instantly for word games, crosswords, and Scrabble."
      canonicalUrl="https://theunscrambled.com/anagram-solver"
    >
      <div class="space-y-12 py-8 text-center max-w-3xl mx-auto">
        <div class="space-y-4">
          <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            Anagram Solver
          </h1>
          <p class="text-base sm:text-lg text-slate-600 leading-relaxed">
            Quickly solve any anagram puzzle or find new words created by rearranging your letters.
          </p>
          <div class="pt-4">
            <SearchBar actionType="anagram" />
          </div>
        </div>

        <div class="text-left bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
          <h2 class="text-xl font-bold text-slate-900">What is an Anagram?</h2>
          <p class="text-sm text-slate-600 leading-relaxed">
            An anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once. For example, <em>cinema</em> is an anagram of <em>iceman</em>, and <em>listen</em> is an anagram of <em>silent</em>.
          </p>

          <h3 class="text-base font-bold text-slate-900 pt-2">How to Use the Anagram Solver</h3>
          <ul class="list-disc list-inside text-sm text-slate-600 space-y-1.5">
            <li>Type any letters into the box above (up to 15 letters).</li>
            <li>Select whether you want <strong>Exact Anagrams</strong> or all possible sub-words (<strong>Unscramble</strong>).</li>
            <li>Click <strong>Solve</strong> to instantly view your word list scored with official Scrabble letter values.</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

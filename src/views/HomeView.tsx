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
            <h2 class="text-lg font-bold text-slate-900">Words by Length</h2>
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
            <h2 class="text-lg font-bold text-slate-900">Browse by Starting Letter</h2>
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
            <h2 class="text-lg font-bold text-slate-900">Prefix & Suffix Solvers</h2>
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
        {/* Comprehensive SEO Content Section */}
        <section class="mt-16 pt-10 border-t border-slate-200/80 space-y-12">
          {/* Section 1: What is The Unscrambled? */}
          <div class="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 class="text-2xl font-bold tracking-tight text-slate-900">
              The Ultimate Free Word Unscrambler & Anagram Solver
            </h2>
            <p class="text-slate-600 leading-relaxed">
              <strong>The Unscrambled</strong> is a lightning-fast anagram generator, word finder, and letter unscrambler designed to help word puzzle enthusiasts, board game competitors, and students find high-scoring vocabulary effortlessly. Whether you are stuck on a challenging rack in <em>Scrabble®</em>, trying to beat your friends in <em>Words with Friends®</em>, conquering daily levels in <em>Wordscapes®</em>, or solving the classic morning newspaper <em>Jumble</em> puzzle, our lookup engine searches through more than 178,000 valid English words in milliseconds.
            </p>
            <p class="text-slate-600 leading-relaxed">
              Every word search organizes results by word length and official Scrabble tile points, complete with dictionary definitions and parts of speech so you can build your vocabulary while winning every game.
            </p>
          </div>

          {/* Section 2: How It Works & Strategies */}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h2 class="text-xl font-bold text-slate-900">
                How Does Our Word Unscrambler Work?
              </h2>
              <ol class="space-y-3 text-sm text-slate-600 list-decimal list-inside leading-relaxed">
                <li>
                  <strong class="text-slate-800">Enter your scrambled letters:</strong> Type up to 15 letters into the search bar above. You can enter them in any order or casing.
                </li>
                <li>
                  <strong class="text-slate-800">Sub-anagram permutation analysis:</strong> Our algorithms instantly cross-reference letter frequencies against an official lexicon stored across distributed edge nodes.
                </li>
                <li>
                  <strong class="text-slate-800">Grouped by length & points:</strong> Words are grouped from longest to shortest (such as 7-letter bingos down to high-leverage 2-letter connectors) with corresponding point valuations.
                </li>
                <li>
                  <strong class="text-slate-800">Instant definitions & synsets:</strong> Click any word to inspect its lexical meanings, phonetics, and usage context.
                </li>
              </ol>
            </div>

            <div class="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h2 class="text-xl font-bold text-slate-900">
                Top Word Game Strategies & Scrabble Tips
              </h2>
              <ul class="space-y-3 text-sm text-slate-600 list-disc list-inside leading-relaxed">
                <li>
                  <strong class="text-slate-800">Master 2-Letter Words:</strong> Two-letter hooks (like <em>QI, ZA, JO, AX, XI</em>) allow you to play parallel words, multiplying your score across adjacent rows or columns.
                </li>
                <li>
                  <strong class="text-slate-800">Save High-Value Letters for Multipliers:</strong> Never discard tiles like <a href="/q-words" class="text-emerald-700 font-semibold hover:underline">Q</a> (10 pts), <a href="/z-words" class="text-emerald-700 font-semibold hover:underline">Z</a> (10 pts), or <a href="/j-words" class="text-emerald-700 font-semibold hover:underline">J</a> (8 pts) on basic tiles—position them on Double Letter (DL) or Triple Letter (TL) squares.
                </li>
                <li>
                  <strong class="text-slate-800">Hunt for the 50-Point Bingo:</strong> Playing all 7 tiles in a single turn yields a 50-point bonus. Look out for high-frequency prefixes like <a href="/words-starting-with-un" class="text-emerald-700 font-semibold hover:underline">UN-</a> and suffixes like <a href="/words-ending-in-ing" class="text-emerald-700 font-semibold hover:underline">-ING</a> or <a href="/words-ending-in-ed" class="text-emerald-700 font-semibold hover:underline">-ED</a>.
                </li>
              </ul>
            </div>
          </div>

          {/* Section 3: Popular Word Games Supported */}
          <div class="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <h2 class="text-2xl font-bold text-slate-900">
                Supported Word Games & Solvers
              </h2>
              <p class="text-slate-600 text-sm mt-1">
                Whether you need a cheat sheet, an anagram checker, or vocabulary trainer, we support all major word platforms:
              </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
                <h3 class="font-bold text-slate-900 mb-1">Scrabble® Word Finder</h3>
                <p class="text-slate-600 text-xs leading-relaxed">
                  Verify validity using standardized official tournament word lists (TWL/CSW) with precise tile score computations.
                </p>
              </div>
              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
                <h3 class="font-bold text-slate-900 mb-1">Words with Friends®</h3>
                <p class="text-slate-600 text-xs leading-relaxed">
                  Generate optimal high-scoring plays specifically tailored for Zynga’s popular mobile game.
                </p>
              </div>
              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
                <h3 class="font-bold text-slate-900 mb-1">Jumble & Anagrams</h3>
                <p class="text-slate-600 text-xs leading-relaxed">
                  Crack newspaper daily jumbles, mixed-letter brain teasers, and multi-word anagrams in an instant.
                </p>
              </div>
              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
                <h3 class="font-bold text-slate-900 mb-1">Wordscapes & Boggle</h3>
                <p class="text-slate-600 text-xs leading-relaxed">
                  Discover all valid permutations and bonus words for circle-swipe games and timed board searches.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Frequently Asked Questions (FAQ) with Schema */}
          <div class="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
            <h2 class="text-2xl font-bold text-slate-900">
              Frequently Asked Questions (FAQ)
            </h2>

            <div class="space-y-4">
              <div class="border-b border-slate-100 pb-4">
                <h3 class="font-bold text-slate-900 text-base">
                  What is a word unscrambler?
                </h3>
                <p class="text-slate-600 text-sm mt-1 leading-relaxed">
                  A word unscrambler is an online utility that takes a randomized set of letters and rearranges them into all valid, dictionary-recognized words. It calculates all combinations and sub-anagrams from your input.
                </p>
              </div>

              <div class="border-b border-slate-100 pb-4">
                <h3 class="font-bold text-slate-900 text-base">
                  How are the Scrabble points calculated?
                </h3>
                <p class="text-slate-600 text-sm mt-1 leading-relaxed">
                  Each letter is assigned its official Scrabble tile value (e.g., A=1, B=3, C=3, D=2, E=1, Q=10, Z=10). Our system sums up the base tile values for every generated word so you can quickly pick the most lucrative option.
                </p>
              </div>

              <div class="border-b border-slate-100 pb-4">
                <h3 class="font-bold text-slate-900 text-base">
                  Is The Unscrambled free to use?
                </h3>
                <p class="text-slate-600 text-sm mt-1 leading-relaxed">
                  Yes, The Unscrambled is completely free and accessible on mobile, tablet, and desktop without requiring any registration or software download.
                </p>
              </div>

              <div>
                <h3 class="font-bold text-slate-900 text-base">
                  What dictionaries are included in the word solver?
                </h3>
                <p class="text-slate-600 text-sm mt-1 leading-relaxed">
                  Our database is built on comprehensive English lexicons containing over 178,000 entries encompassing standard North American and International English dictionaries, including WordNet synset definitions.
                </p>
              </div>
            </div>

            {/* FAQPage JSON-LD schema */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "What is a word unscrambler?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "A word unscrambler is an online tool that takes a randomized string of letters and rearranges them into all valid, dictionary-recognized words and anagrams."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "How are the Scrabble points calculated?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Each letter is assigned its official Scrabble tile value (e.g., A=1, B=3, C=3, Q=10, Z=10). The score displayed represents the sum of those base tile values."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Is The Unscrambled free to use?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes, The Unscrambled is 100% free on desktop and mobile devices without registration."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "What dictionaries are included in the word solver?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "The solver uses comprehensive English lexicons with over 178,000 words, including WordNet synsets and tournament-compatible word lists."
                      }
                    }
                  ]
                })
              }}
            />
          </div>
        </section>
      </div>
    </Layout>
  );
};


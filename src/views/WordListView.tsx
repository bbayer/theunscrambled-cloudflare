import type { FC } from "hono/jsx";
import { Layout } from "./Layout";
import { WordCard, Pagination, SearchBar } from "./components";
import type { PaginatedWords } from "../lib/db";
import { calcScrabbleScore } from "../lib/wordMath";

export interface WordListProps {
  title: string;
  headline: string;
  description: string;
  canonicalUrl: string;
  basePath: string;
  data: PaginatedWords;
}

export const WordListView: FC<WordListProps> = ({
  title,
  headline,
  description,
  canonicalUrl,
  basePath,
  data,
}) => {
  const { words, total, page, totalPages } = data;

  return (
    <Layout title={title} description={description} canonicalUrl={canonicalUrl}>
      <div class="space-y-8">
        <section class="text-center space-y-4 pt-4">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {total.toLocaleString()} Total Words
          </div>

          <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            {headline}
          </h1>

          <p class="text-slate-600 max-w-xl mx-auto text-sm sm:text-base">
            {description}
          </p>

          <div class="pt-2">
            <SearchBar />
          </div>
        </section>

        {words.length === 0 ? (
          <div class="p-12 text-center rounded-2xl bg-white border border-slate-200/80 space-y-3">
            <p class="text-lg font-bold text-slate-700">No words found</p>
            <p class="text-sm text-slate-500">Try browsing another category or length.</p>
          </div>
        ) : (
          <div class="space-y-6">
            <div class="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200">
              <span>
                Showing page <strong>{page}</strong> of <strong>{totalPages}</strong>
              </span>
              <span>Sorted Alphabetically</span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {words.map((w) => (
                <WordCard word={w} score={calcScrabbleScore(w)} length={w.length} />
              ))}
            </div>

            <Pagination current={page} total={totalPages} basePath={basePath} />
          </div>
        )}
      </div>
    </Layout>
  );
};

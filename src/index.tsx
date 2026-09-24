import { Hono } from "hono";
import { WordDB } from "./lib/db";
import { cleanRack } from "./lib/wordMath";
import { HomeView } from "./views/HomeView";
import { UnscrambleView } from "./views/UnscrambleView";
import { AnagramView, AnagramSolverLandingView } from "./views/AnagramView";
import { WordListView } from "./views/WordListView";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// 1. Home Page
app.get("/", (c) => {
  return c.html(<HomeView />);
});

// 2. Anagram Solver Landing
app.get("/anagram-solver", (c) => {
  return c.html(<AnagramSolverLandingView />);
});

// Dynamic Sitemap
app.get("/sitemap.xml", (c) => {
  const baseUrl = "https://theunscrambled.com";
  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
  const lengths = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  const popularAffixes = [
    "un", "re", "in", "dis", "pre", "non", "anti", "mis",
    "ing", "ed", "er", "est", "ly", "tion", "able", "ness"
  ];
  const sampleWords = [
    "plane", "apple", "crane", "table", "slate", "admirer", "listen",
    "silence", "garden", "master", "orange", "friend", "player"
  ];

  const urls: { loc: string; priority: string; changefreq: string }[] = [];

  // Home & Landing
  urls.push({ loc: `${baseUrl}/`, priority: "1.0", changefreq: "daily" });
  urls.push({ loc: `${baseUrl}/anagram-solver`, priority: "0.9", changefreq: "weekly" });

  // Letter Hubs
  for (const l of alphabet) {
    urls.push({ loc: `${baseUrl}/${l}-words`, priority: "0.8", changefreq: "weekly" });
  }

  // Length Hubs
  for (const len of lengths) {
    urls.push({ loc: `${baseUrl}/${len}-letter-words`, priority: "0.8", changefreq: "weekly" });
  }

  // Prefix / Suffix
  for (const affix of popularAffixes) {
    urls.push({ loc: `${baseUrl}/words-starting-with-${affix}`, priority: "0.7", changefreq: "weekly" });
    urls.push({ loc: `${baseUrl}/words-ending-in-${affix}`, priority: "0.7", changefreq: "weekly" });
  }

  // Popular Words
  for (const w of sampleWords) {
    urls.push({ loc: `${baseUrl}/unscramble-${w}`, priority: "0.7", changefreq: "monthly" });
    urls.push({ loc: `${baseUrl}/anagram-of-${w}`, priority: "0.7", changefreq: "monthly" });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return c.text(xml, 200, {
    "Content-Type": "application/xml; charset=utf-8",
    "Cache-Control": "public, max-age=86400",
  });
});

// Robots.txt
app.get("/robots.txt", (c) => {
  const content = `User-agent: *
Allow: /

Sitemap: https://theunscrambled.com/sitemap.xml
`;
  return c.text(content, 200, { "Content-Type": "text/plain" });
});

// Ads.txt for AdSense
app.get("/ads.txt", (c) => {
  const content = `google.com, pub-3302383181316413, DIRECT, f08c47fec0942fa0\n`;
  return c.text(content, 200, { "Content-Type": "text/plain" });
});

// Handler for slug pages with page number
async function handleSlugPage(c: any, slug: string, pageNum: number) {
  const db = new WordDB(c.env.DB);
  const page = Math.max(1, pageNum);

  // 1. Words by Length: e.g. 5-letter-words
  const lengthMatch = slug.match(/^(\d+)-letter-words$/);
  if (lengthMatch) {
    const length = parseInt(lengthMatch[1], 10);
    if (length < 2 || length > 30) return c.notFound();

    const data = await db.getWordsByLength(length, page, 96);
    return c.html(
      <WordListView
        title={`${length} Letter Words ${page > 1 ? `- Page ${page}` : ""} | The Unscrambled`}
        headline={`${length}-Letter Words ${page > 1 ? `(Page ${page})` : ""}`}
        description={`Browse our complete dictionary of ${length}-letter words, perfect for Scrabble, Words with Friends, and word puzzles.`}
        canonicalUrl={`https://theunscrambled.com/${length}-letter-words${page > 1 ? `/${page}` : ""}`}
        basePath={`/${length}-letter-words`}
        data={data}
      />
    );
  }

  // 2. Words by Letter: e.g. j-words
  const letterMatch = slug.match(/^([a-z])-words$/i);
  if (letterMatch) {
    const letterParam = letterMatch[1].toLowerCase();
    const data = await db.getWordsStartingWith(letterParam, page, 96);
    const upper = letterParam.toUpperCase();

    return c.html(
      <WordListView
        title={`Words Starting with ${upper} ${page > 1 ? `- Page ${page}` : ""} | The Unscrambled`}
        headline={`Words Starting with "${upper}" ${page > 1 ? `(Page ${page})` : ""}`}
        description={`Complete list of words starting with the letter ${upper}, scored with official Scrabble point values.`}
        canonicalUrl={`https://theunscrambled.com/${letterParam}-words${page > 1 ? `/${page}` : ""}`}
        basePath={`/${letterParam}-words`}
        data={data}
      />
    );
  }

  // 3. Words Starting With Prefix: words-starting-with-xyz
  if (slug.startsWith("words-starting-with-")) {
    const rawPrefix = slug.replace("words-starting-with-", "");
    const clean = cleanRack(rawPrefix);
    if (!clean) return c.redirect("/");
    if (clean.length === 1) return c.redirect(`/${clean}-words`, 301);
    if (rawPrefix !== clean) return c.redirect(`/words-starting-with-${clean}`, 301);

    const data = await db.getWordsStartingWith(clean, page, 96);
    const upper = clean.toUpperCase();
    return c.html(
      <WordListView
        title={`Words Starting with "${upper}" ${page > 1 ? `- Page ${page}` : ""} | The Unscrambled`}
        headline={`Words Starting with "${upper}" ${page > 1 ? `(Page ${page})` : ""}`}
        description={`Find all valid words that begin with the prefix "${upper}", scored with Scrabble point values.`}
        canonicalUrl={`https://theunscrambled.com/words-starting-with-${clean}${page > 1 ? `/${page}` : ""}`}
        basePath={`/words-starting-with-${clean}`}
        data={data}
      />
    );
  }

  // 4. Words Ending In Suffix: words-ending-in-xyz
  if (slug.startsWith("words-ending-in-")) {
    const rawSuffix = slug.replace("words-ending-in-", "");
    const clean = cleanRack(rawSuffix);
    if (!clean) return c.redirect("/");
    if (rawSuffix !== clean) return c.redirect(`/words-ending-in-${clean}`, 301);

    const data = await db.getWordsEndingWith(clean, page, 96);
    const upper = clean.toUpperCase();
    return c.html(
      <WordListView
        title={`Words Ending in "${upper}" ${page > 1 ? `- Page ${page}` : ""} | The Unscrambled`}
        headline={`Words Ending in "${upper}" ${page > 1 ? `(Page ${page})` : ""}`}
        description={`Find all valid words ending with "${upper}", sorted alphabetically with Scrabble scores.`}
        canonicalUrl={`https://theunscrambled.com/words-ending-in-${clean}${page > 1 ? `/${page}` : ""}`}
        basePath={`/words-ending-in-${clean}`}
        data={data}
      />
    );
  }

  return c.notFound();
}

// Route for paginated URLs: /5-letter-words/2 or /j-words/2
app.get("/:slug/:page", async (c) => {
  const slug = c.req.param("slug") || "";
  const pageParam = c.req.param("page") || "";
  const page = parseInt(pageParam, 10);
  if (isNaN(page) || page < 1) return c.notFound();
  if (page === 1) return c.redirect(`/${slug}`, 301);

  return handleSlugPage(c, slug, page);
});

// Route for root slugs: /unscramble-word, /5-letter-words, /j-words, etc.
app.get("/:slug", async (c) => {
  const slug = c.req.param("slug") || "";

  // 1. Unscramble: unscramble-word
  if (slug.startsWith("unscramble-")) {
    const rawWord = slug.replace("unscramble-", "");
    const clean = cleanRack(rawWord);
    if (!clean || clean.length < 2) return c.redirect("/");
    if (rawWord !== clean) return c.redirect(`/unscramble-${clean}`, 301);

    const db = new WordDB(c.env.DB);
    const data = await db.unscramble(clean);
    return c.html(<UnscrambleView data={data} />);
  }

  // 2. Anagram: anagram-of-word
  if (slug.startsWith("anagram-of-")) {
    const rawWord = slug.replace("anagram-of-", "");
    const clean = cleanRack(rawWord);
    if (!clean || clean.length < 2) return c.redirect("/");
    if (rawWord !== clean) return c.redirect(`/anagram-of-${clean}`, 301);

    const db = new WordDB(c.env.DB);
    const anagrams = await db.getExactAnagrams(clean);
    return c.html(<AnagramView word={clean} anagrams={anagrams} />);
  }

  // Handle pagination via query param ?page=2 as well
  const queryPage = parseInt(c.req.query("page") || "1", 10);
  return handleSlugPage(c, slug, isNaN(queryPage) ? 1 : queryPage);
});

export default app;

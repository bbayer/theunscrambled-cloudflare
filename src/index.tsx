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

// Catch-all route handler for dynamic paths
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

  // 3. Words by Length: 5-letter-words
  const lengthMatch = slug.match(/^(\d+)-letter-words$/);
  if (lengthMatch) {
    const length = parseInt(lengthMatch[1], 10);
    if (length < 2 || length > 30) return c.notFound();

    const page = Math.max(1, parseInt(c.req.query("page") || "1", 10));
    const db = new WordDB(c.env.DB);
    const data = await db.getWordsByLength(length, page, 96);

    return c.html(
      <WordListView
        title={`${length} Letter Words - Complete List of Words with ${length} Letters | The Unscrambled`}
        headline={`${length}-Letter Words`}
        description={`Browse our complete dictionary of ${length}-letter words, perfect for Scrabble, Words with Friends, and word puzzles.`}
        canonicalUrl={`https://theunscrambled.com/${length}-letter-words`}
        basePath={`/${length}-letter-words`}
        data={data}
      />
    );
  }

  // 4. Words by Letter: j-words
  const letterMatch = slug.match(/^([a-z])-words$/i);
  if (letterMatch) {
    const letterParam = letterMatch[1].toLowerCase();
    const page = Math.max(1, parseInt(c.req.query("page") || "1", 10));
    const db = new WordDB(c.env.DB);
    const data = await db.getWordsStartingWith(letterParam, page, 96);

    const upper = letterParam.toUpperCase();
    return c.html(
      <WordListView
        title={`Words Starting with ${upper} - ${upper} Words List | The Unscrambled`}
        headline={`Words Starting with "${upper}"`}
        description={`Complete list of words starting with the letter ${upper}, scored with official Scrabble point values.`}
        canonicalUrl={`https://theunscrambled.com/${letterParam}-words`}
        basePath={`/${letterParam}-words`}
        data={data}
      />
    );
  }

  // 5. Words Starting With Prefix: words-starting-with-xyz
  if (slug.startsWith("words-starting-with-")) {
    const rawPrefix = slug.replace("words-starting-with-", "");
    const clean = cleanRack(rawPrefix);
    if (!clean) return c.redirect("/");
    if (clean.length === 1) return c.redirect(`/${clean}-words`, 301);
    if (rawPrefix !== clean) return c.redirect(`/words-starting-with-${clean}`, 301);

    const page = Math.max(1, parseInt(c.req.query("page") || "1", 10));
    const db = new WordDB(c.env.DB);
    const data = await db.getWordsStartingWith(clean, page, 96);

    const upper = clean.toUpperCase();
    return c.html(
      <WordListView
        title={`Words Starting with "${upper}" - Prefix Word Finder | The Unscrambled`}
        headline={`Words Starting with "${upper}"`}
        description={`Find all valid words that begin with the prefix "${upper}", scored with Scrabble point values.`}
        canonicalUrl={`https://theunscrambled.com/words-starting-with-${clean}`}
        basePath={`/words-starting-with-${clean}`}
        data={data}
      />
    );
  }

  // 6. Words Ending In Suffix: words-ending-in-xyz
  if (slug.startsWith("words-ending-in-")) {
    const rawSuffix = slug.replace("words-ending-in-", "");
    const clean = cleanRack(rawSuffix);
    if (!clean) return c.redirect("/");
    if (rawSuffix !== clean) return c.redirect(`/words-ending-in-${clean}`, 301);

    const page = Math.max(1, parseInt(c.req.query("page") || "1", 10));
    const db = new WordDB(c.env.DB);
    const data = await db.getWordsEndingWith(clean, page, 96);

    const upper = clean.toUpperCase();
    return c.html(
      <WordListView
        title={`Words Ending in "${upper}" - Suffix Word Finder | The Unscrambled`}
        headline={`Words Ending in "${upper}"`}
        description={`Find all valid words ending with "${upper}", sorted alphabetically with Scrabble scores.`}
        canonicalUrl={`https://theunscrambled.com/words-ending-in-${clean}`}
        basePath={`/words-ending-in-${clean}`}
        data={data}
      />
    );
  }

  return c.notFound();
});

export default app;

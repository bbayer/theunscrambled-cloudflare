# The Unscrambled

Ultra-fast word unscrambler, anagram solver, and Scrabble / Words with Friends word finder built with **Hono**, **TypeScript**, and **D1 SQLite Database**.

---

## Features

- **Word Unscrambler (`/unscramble-:word`)**: Finds all valid sub-words and anagrams for any letter rack (up to 12+ letters), sorted by length and Scrabble tile points.
- **Exact Anagram Solver (`/anagram-of-:word`)**: Instant lookup of exact anagrams using sorted-letter indexes.
- **Word Length Dictionaries (`/:length-letter-words`)**: Paginated dictionaries from 2-letter combos to 15-letter master words.
- **Starting Letter Hubs (`/:letter-words`)**: Standard A-Z hubs and high-value letter pages (Q, Z, X, J).
- **Prefix & Suffix Solvers (`/words-starting-with-:prefix`, `/words-ending-in-:suffix`)**: Perfect for crossword solving and board game hooks.
- **Lexical Definitions**: Synsets, phonetic/word types, and definitions from WordNet.
- **High-Performance & Low D1 Row Reads**:
  - Precomputed word counts (`word_counts` table + in-memory maps) to eliminate expensive `SELECT COUNT(*)` full-table scans.
  - B-tree range queries (`word >= ? AND word < ?`) for fast, indexed prefix pagination.
  - Batched anagram queries to minimize roundtrips.
- **SEO & Search Engines**:
  - Dynamic XML Sitemap (`/sitemap.xml`).
  - Google Analytics (`G-W2L8DX0CTX`) and Google AdSense (`ca-pub-3302383181316413`) integrated with `/ads.txt`.
  - Schema.org structured data (`WebSite` search action and `FAQPage` microdata).

---

## Tech Stack

- **Framework**: [Hono](https://hono.dev/) (JSX SSR)
- **Database**: D1 (Serverless SQLite)
- **Styling**: Tailwind CSS
- **Runtime**: Workers (TypeScript)

---

## Project Structure

```text
├── migrations/             # SQL schema migrations
│   ├── 0001_init.sql       # Anagrams & words tables with indexes
│   ├── 0002_synsets.sql    # Synsets & definitions table
│   └── 0003_word_counts.sql# Precomputed word counts for zero-read counting
├── scripts/                # Database population and sync utilities
│   ├── generate_word_counts_migration.py
│   └── sync_full_local.py
├── src/
│   ├── index.tsx           # Hono router and URL handlers
│   ├── lib/
│   │   ├── db.ts           # D1 database queries & unscramble algorithm
│   │   ├── wordCounts.ts   # In-memory precomputed counts & range helpers
│   │   └── wordMath.ts     # Permutations, combinations, Scrabble scoring
│   └── views/              # Server-rendered JSX components
│       ├── AnagramView.tsx
│       ├── HomeView.tsx
│       ├── Layout.tsx
│       ├── UnscrambleView.tsx
│       ├── WordListView.tsx
│       └── components.tsx
├── wrangler.json           # Wrangler configuration and D1 database binding
└── package.json
```

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
The server will start at `http://127.0.0.1:8787`.

### 3. Verify TypeScript & Bundle
```bash
npm run check
```

---

## Database Migrations

### Local Database
```bash
# Apply pending migrations to local SQLite D1
npx wrangler d1 migrations apply theunscrambled-db --local
```

### Remote Production Database
```bash
# Apply migrations to remote D1
npx wrangler d1 migrations apply theunscrambled-db --remote
```

---

## Deployment

Deploy the project to production:
```bash
npm run deploy
```

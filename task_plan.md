# Task Plan: D1 Row Read & Query Performance Optimization

## Goal
Eliminate massive Cloudflare D1 row reads (reported 7B+ reads) by removing full-table scans (`words WHERE word LIKE ?`), precomputing static counts, replacing prefix `LIKE` with B-tree range scans, and optimizing anagram batch queries and synset definition lookups.

---

## Analysis of Top 4 Queries from User Screenshot

| Rank | Query Pattern | % Runtime | Execution Count | Root Cause of Row Reads | Planned Optimization |
|---|---|---|---|---|---|
| **#1** | `SELECT COUNT(*) as cnt FROM words WHERE word LIKE ?` | **40.57%** | 47,898 | Full-table scan of all 178,691 rows on every pagination request (`word LIKE 'a%'`, `word LIKE '%ing'`). | **Static precomputed counts table & code map.** Read 0-1 rows instead of 178,691 rows per call. |
| **#2** | `SELECT word FROM words WHERE word LIKE ? ORDER BY word ASC LIMIT ? OFFSET ?` | **29.42%** | 38,009 | `LIKE 'prefix%'` causes full index/table scan in SQLite rather than B-tree range search. | **Convert prefix to B-tree range:** `word >= ? AND word < ?`. For suffixes, precompute top common suffixes or add indexed reversed word column. |
| **#3** | `SELECT data FROM anagrams WHERE anagram IN (?,?,...,?)` | **24.02%** | 1,149,611 | Runs on `/unscramble-:rack` across combinations. 1.15M executions. Reads rows via `anagram` index. | **Reduce redundant combinations & batch size optimization.** Cache common racks and clamp combinations safely. |
| **#4** | `SELECT syn, type, definition FROM synsets WHERE word = ? LIMIT 10` | **2.94%** | 201,377 | `synsets.word` table lookup. Checked every time unscramble or anagram view loads. | **Add index on `synsets(word)`** if missing, ensuring instant 1-point index lookups. |

---

## Phases

- [x] **Phase 1: Database Analysis & Schema Verification**
  - Verified indexes on `synsets`, `words`, and `anagrams`.
- [x] **Phase 2: Precomputed Counts Architecture (Solve Query #1 - 40.57% runtime)**
  - Created migration `0003_word_counts.sql` with table `word_counts(key TEXT PRIMARY KEY, count INTEGER NOT NULL)` containing 36,072 precalculated counts.
  - Built static fallback map `STATIC_LENGTH_COUNTS`, `STATIC_LETTER_COUNTS`, `STATIC_PREFIX_COUNTS`, and `STATIC_SUFFIX_COUNTS` in `src/lib/wordCounts.ts` (0 D1 row reads for all standard hubs).
  - Updated `WordDB.getWordsByLength`, `getWordsStartingWith`, and `getWordsEndingWith` to query in-memory maps and `word_counts` table instead of full-table scans.
- [x] **Phase 3: Index Range Optimization for Prefix Queries (Solve Query #2 - 29.42% runtime)**
  - Replaced `word LIKE ?` with indexed B-tree range scan: `word >= ? AND word < ?`.
  - Verified SQLite query plan executes `SEARCH words USING COVERING INDEX (word>? AND word<?)` reading only the exact `LIMIT 96` slice.
- [x] **Phase 4: Suffix & Unscramble / Anagram Query Optimization (Solve Queries #3 & #4)**
  - Increased batch size from 50 to 90 for anagram combination queries in `db.ts`, reducing roundtrips by almost half.
  - Verified `idx_synsets_word` index exists on `synsets(word)`.
- [x] **Phase 5: Verification & Local Testing**
  - Verified `npm run check` passes with 0 errors.
  - Verified all local endpoints return HTTP 200.

# Progress Log

## Session: 2026-09-25
- Analyzed top 4 queries from Cloudflare D1 telemetry provided by user:
  1. `SELECT COUNT(*) FROM words WHERE word LIKE ?` (40.57% runtime, 47,898 calls = 8.5B rows scanned)
  2. `SELECT word FROM words WHERE word LIKE ? ... LIMIT OFFSET` (29.42% runtime, 38,009 calls)
  3. `SELECT data FROM anagrams WHERE anagram IN (...)` (24.02% runtime, 1.15M calls)
  4. `SELECT syn, type, definition FROM synsets WHERE word = ?` (2.94% runtime, 201K calls)
- Created `task_plan.md` and `findings.md`.
- Generated and applied migration `0003_word_counts.sql` with 36,072 precalculated prefix, suffix, and length counts.
- Created `src/lib/wordCounts.ts` containing static in-memory count dictionaries (0 D1 row reads for all common pages).
- Optimized `WordDB.getWordsByLength`, `getWordsStartingWith`, and `getWordsEndingWith` in `src/lib/db.ts` to use precalculated counts instead of `SELECT COUNT(*)`.
- Optimized `getWordsStartingWith` to use indexed B-tree range queries (`word >= ? AND word < ?`) instead of full `LIKE` scans.
- Increased batch size from 50 to 90 for anagram combination queries in `unscramble()`.
- Successfully verified with `npm run check` and tested live local endpoints.

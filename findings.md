# Research & Technical Findings: D1 Row Read Optimization

## 1. Breakdown of Expensive Queries (from user Cloudflare dashboard)

### Query 1: `SELECT COUNT(*) as cnt FROM words WHERE word LIKE ?`
- **Impact**: 40.57% of runtime, 47,898 executions.
- **Cause**: In SQLite, `LIKE` with wildcards cannot use simple b-tree comparisons unless using `LIKE_EXACT` pragma or case-sensitive match. For each call, it scans all 178,691 rows in `words` table.
- **Math**: 47,898 × 178,691 ≈ **8.55 Billion row reads!** This is the exact source of the 7B+ reads!
- **Fix**: Precomputed counts stored in `word_counts` table + in-memory TypeScript constant map. Cost per call drops from 178,691 row reads to **0-1 row reads**.

### Query 2: `SELECT word FROM words WHERE word LIKE ? ORDER BY word ASC LIMIT ? OFFSET ?`
- **Impact**: 29.42% of runtime, 38,009 executions.
- **Cause**: `word LIKE 'prefix%'` scans `idx_words_length` or table, reading tens of thousands of rows to find matches and sort them.
- **Math**: 38,009 × average rows scanned = hundreds of millions of row reads.
- **Fix**: For prefixes, replace with `word >= :start AND word < :end` where `:end` is the next lexicographical string (e.g. `un` -> `uo`). SQLite optimizes this as `SEARCH words USING COVERING INDEX sqlite_autoindex_words_1 (word>? AND word<?)`. It only reads the exact `LIMIT 96` rows!

### Query 3: `SELECT data FROM anagrams WHERE anagram IN (?, ?, ...)`
- **Impact**: 24.02% of runtime, 1,149,611 executions.
- **Cause**: Called in loops of 50 during `/unscramble-:rack` combinations.
- **Observation**: `anagrams` table has `anagram TEXT PRIMARY KEY`. Index seek is fast, but 1.15M queries run because combination sets can be large for 10-12 letter words.
- **Fix**: Cache unscramble results for common words / limit combination generation safely / increase batch efficiency.

### Query 4: `SELECT syn, type, definition FROM synsets WHERE word = ? LIMIT 10`
- **Impact**: 2.94% of runtime, 201,377 executions.
- **Verification needed**: Ensure `CREATE INDEX IF NOT EXISTS idx_synsets_word ON synsets(word)` exists in production D1 database. Without this index, every definition lookup scans 236,340 synset rows!

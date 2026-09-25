import { cleanRack, sortWord, getRackCombinations, calcScrabbleScore } from "./wordMath";
import {
  STATIC_LENGTH_COUNTS,
  STATIC_LETTER_COUNTS,
  STATIC_PREFIX_COUNTS,
  STATIC_SUFFIX_COUNTS,
  getNextPrefix,
} from "./wordCounts";

export interface WordResult {
  word: string;
  score: number;
  length: number;
}

export interface UnscrambleResponse {
  rack: string;
  totalWords: number;
  wordsByLength: Record<number, WordResult[]>;
  availableLengths: number[];
}

export interface PaginatedWords {
  words: string[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class WordDB {
  constructor(private db: D1Database) {}

  /**
   * Exact anagrams: Words made of the exact same letters
   */
  async getExactAnagrams(rack: string): Promise<WordResult[]> {
    const clean = cleanRack(rack);
    if (clean.length < 2) return [];

    const sorted = sortWord(clean);
    const row = await this.db
      .prepare("SELECT data FROM anagrams WHERE anagram = ?")
      .bind(sorted)
      .first<{ data: string }>();

    if (!row || !row.data) return [];

    const words = row.data.split(/\s+/).filter(Boolean);
    return words.map((w) => ({
      word: w,
      score: calcScrabbleScore(w),
      length: w.length,
    }));
  }

  /**
   * Unscramble: Find all valid words formed by any combination of letters in the rack
   */
  async unscramble(rack: string): Promise<UnscrambleResponse> {
    const clean = cleanRack(rack);
    if (clean.length < 2) {
      return {
        rack: clean,
        totalWords: 0,
        wordsByLength: {},
        availableLengths: [],
      };
    }

    const sorted = sortWord(clean);
    // Limit combinations to max 12 letters for performance safety
    const safeSorted = sorted.slice(0, 12);
    const combs = getRackCombinations(safeSorted, 2);

    if (combs.length === 0) {
      return {
        rack: clean,
        totalWords: 0,
        wordsByLength: {},
        availableLengths: [],
      };
    }

    // D1 / SQLite parameter batching (90 per batch to minimize SQL queries)
    const batchSize = 90;
    const allWordsSet = new Set<string>();

    for (let i = 0; i < combs.length; i += batchSize) {
      const chunk = combs.slice(i, i + batchSize);
      const placeholders = chunk.map(() => "?").join(",");
      const query = `SELECT data FROM anagrams WHERE anagram IN (${placeholders})`;
      const { results } = await this.db
        .prepare(query)
        .bind(...chunk)
        .all<{ data: string }>();

      if (results) {
        for (const row of results) {
          if (row.data) {
            const list = row.data.split(/\s+/).filter(Boolean);
            for (const w of list) {
              allWordsSet.add(w);
            }
          }
        }
      }
    }

    const wordsByLength: Record<number, WordResult[]> = {};
    for (const w of allWordsSet) {
      const len = w.length;
      if (!wordsByLength[len]) {
        wordsByLength[len] = [];
      }
      wordsByLength[len].push({
        word: w,
        score: calcScrabbleScore(w),
        length: len,
      });
    }

    // Sort words in each length group by Scrabble score (desc) then alphabetically
    const lengths = Object.keys(wordsByLength)
      .map(Number)
      .sort((a, b) => b - a);

    for (const len of lengths) {
      wordsByLength[len].sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.word.localeCompare(b.word);
      });
    }

    return {
      rack: clean,
      totalWords: allWordsSet.size,
      wordsByLength,
      availableLengths: lengths,
    };
  }

  /**
   * Words by length with pagination
   * Optimized: Uses STATIC_LENGTH_COUNTS to eliminate SELECT COUNT(*) full-table scan.
   */
  async getWordsByLength(
    length: number,
    page: number = 1,
    pageSize: number = 96
  ): Promise<PaginatedWords> {
    const offset = Math.max(0, (page - 1) * pageSize);

    // 1. Get count from static in-memory map or precomputed word_counts table (0 to 1 row read)
    let total = STATIC_LENGTH_COUNTS[length];
    if (total === undefined) {
      const countRow = await this.db
        .prepare("SELECT count FROM word_counts WHERE key = ?")
        .bind(`len:${length}`)
        .first<{ count: number }>();
      total = countRow ? countRow.count : 0;
    }

    const totalPages = Math.ceil(total / pageSize);

    const { results } = await this.db
      .prepare(
        "SELECT word FROM words WHERE length = ? ORDER BY word ASC LIMIT ? OFFSET ?"
      )
      .bind(length, pageSize, offset)
      .all<{ word: string }>();

    return {
      words: results ? results.map((r) => r.word) : [],
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  /**
   * Words starting with a specific prefix
   * Optimized:
   * 1. Count uses in-memory map -> word_counts table -> range COUNT (never full LIKE scan).
   * 2. Select uses B-tree range scan: `word >= :clean AND word < :nextPrefix`.
   */
  async getWordsStartingWith(
    prefix: string,
    page: number = 1,
    pageSize: number = 96
  ): Promise<PaginatedWords> {
    const clean = cleanRack(prefix);
    const offset = Math.max(0, (page - 1) * pageSize);
    const nextPrefix = getNextPrefix(clean);

    // 1. Resolve count with 0 row reads if in static dictionary
    let total: number | undefined;
    if (clean.length === 1 && STATIC_LETTER_COUNTS[clean] !== undefined) {
      total = STATIC_LETTER_COUNTS[clean];
    } else if (STATIC_PREFIX_COUNTS[clean] !== undefined) {
      total = STATIC_PREFIX_COUNTS[clean];
    }

    // 2. Fallback to word_counts table (1 row read)
    if (total === undefined) {
      const countRow = await this.db
        .prepare("SELECT count FROM word_counts WHERE key = ?")
        .bind(`pref:${clean}`)
        .first<{ count: number }>();

      if (countRow) {
        total = countRow.count;
      }
    }

    // 3. Fallback to indexed B-tree range count if not found in precomputed table
    if (total === undefined) {
      const rangeCountRow = await this.db
        .prepare("SELECT COUNT(*) as cnt FROM words WHERE word >= ? AND word < ?")
        .bind(clean, nextPrefix)
        .first<{ cnt: number }>();
      total = rangeCountRow ? rangeCountRow.cnt : 0;
    }

    const totalPages = Math.ceil(total / pageSize);

    // 4. Fetch page slice using covering B-tree index (word >= ? AND word < ?)
    const { results } = await this.db
      .prepare(
        "SELECT word FROM words WHERE word >= ? AND word < ? ORDER BY word ASC LIMIT ? OFFSET ?"
      )
      .bind(clean, nextPrefix, pageSize, offset)
      .all<{ word: string }>();

    return {
      words: results ? results.map((r) => r.word) : [],
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  /**
   * Words ending in a specific suffix
   * Optimized: Count uses static map -> word_counts table (avoids 178k row scan).
   */
  async getWordsEndingWith(
    suffix: string,
    page: number = 1,
    pageSize: number = 96
  ): Promise<PaginatedWords> {
    const clean = cleanRack(suffix);
    const offset = Math.max(0, (page - 1) * pageSize);
    const likePattern = `%${clean}`;

    // 1. Resolve count from static map (0 row reads)
    let total = STATIC_SUFFIX_COUNTS[clean];

    // 2. Fallback to word_counts table (1 row read)
    if (total === undefined) {
      const countRow = await this.db
        .prepare("SELECT count FROM word_counts WHERE key = ?")
        .bind(`suff:${clean}`)
        .first<{ count: number }>();

      if (countRow) {
        total = countRow.count;
      }
    }

    // 3. Absolute fallback only if entirely unknown suffix
    if (total === undefined) {
      const countRow = await this.db
        .prepare("SELECT COUNT(*) as cnt FROM words WHERE word LIKE ?")
        .bind(likePattern)
        .first<{ cnt: number }>();
      total = countRow ? countRow.cnt : 0;
    }

    const totalPages = Math.ceil(total / pageSize);

    const { results } = await this.db
      .prepare(
        "SELECT word FROM words WHERE word LIKE ? ORDER BY word ASC LIMIT ? OFFSET ?"
      )
      .bind(likePattern, pageSize, offset)
      .all<{ word: string }>();

    return {
      words: results ? results.map((r) => r.word) : [],
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  /**
   * Word definitions from synsets
   */
  async getDefinitions(word: string): Promise<WordDefinition[]> {
    const clean = cleanRack(word);
    if (!clean) return [];

    const { results } = await this.db
      .prepare("SELECT syn, type, definition FROM synsets WHERE word = ? LIMIT 10")
      .bind(clean)
      .all<WordDefinition>();

    return results || [];
  }
}

export interface WordDefinition {
  syn?: string;
  type?: string;
  definition: string;
}

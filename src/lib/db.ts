import { cleanRack, sortWord, getRackCombinations, calcScrabbleScore } from "./wordMath";

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

    // D1 / SQLite parameter batching (e.g. 50 per batch)
    const batchSize = 50;
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
   */
  async getWordsByLength(
    length: number,
    page: number = 1,
    pageSize: number = 96
  ): Promise<PaginatedWords> {
    const offset = Math.max(0, (page - 1) * pageSize);

    const countRow = await this.db
      .prepare("SELECT COUNT(*) as cnt FROM words WHERE length = ?")
      .bind(length)
      .first<{ cnt: number }>();

    const total = countRow ? countRow.cnt : 0;
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
   */
  async getWordsStartingWith(
    prefix: string,
    page: number = 1,
    pageSize: number = 96
  ): Promise<PaginatedWords> {
    const clean = cleanRack(prefix);
    const offset = Math.max(0, (page - 1) * pageSize);
    const likePattern = `${clean}%`;

    const countRow = await this.db
      .prepare("SELECT COUNT(*) as cnt FROM words WHERE word LIKE ?")
      .bind(likePattern)
      .first<{ cnt: number }>();

    const total = countRow ? countRow.cnt : 0;
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
   * Words ending in a specific suffix
   */
  async getWordsEndingWith(
    suffix: string,
    page: number = 1,
    pageSize: number = 96
  ): Promise<PaginatedWords> {
    const clean = cleanRack(suffix);
    const offset = Math.max(0, (page - 1) * pageSize);
    const likePattern = `%${clean}`;

    const countRow = await this.db
      .prepare("SELECT COUNT(*) as cnt FROM words WHERE word LIKE ?")
      .bind(likePattern)
      .first<{ cnt: number }>();

    const total = countRow ? countRow.cnt : 0;
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
}

-- Initial migration for The Unscrambled
CREATE TABLE IF NOT EXISTS anagrams (
    anagram TEXT PRIMARY KEY,
    data TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_anagrams_key ON anagrams (anagram);

CREATE TABLE IF NOT EXISTS words (
    word TEXT PRIMARY KEY,
    length INTEGER NOT NULL,
    sorted_letters TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_words_length ON words (length, word);
CREATE INDEX IF NOT EXISTS idx_words_letters ON words (sorted_letters);

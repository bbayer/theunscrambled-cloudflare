-- Migration 0002: Add synsets definitions table
CREATE TABLE IF NOT EXISTS synsets (
    word TEXT NOT NULL,
    syn TEXT,
    type TEXT,
    definition TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_synsets_word ON synsets (word);

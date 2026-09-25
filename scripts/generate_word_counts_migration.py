import sqlite3
import glob
from collections import Counter

dbs = glob.glob('.wrangler/state/v3/d1/**/*.sqlite', recursive=True)
if not dbs:
    print("No sqlite db found")
    exit(1)

conn = sqlite3.connect(dbs[0])
cur = conn.cursor()

cur.execute("SELECT word, length FROM words")
all_words = cur.fetchall()

entries = []

# Lengths
len_counts = Counter(r[1] for r in all_words)
for l, cnt in len_counts.items():
    entries.append((f"len:{l}", cnt))

# Prefixes & Suffixes (1-4 characters)
prefix_counter = Counter()
suffix_counter = Counter()
for w, _ in all_words:
    for n in (1, 2, 3, 4):
        if len(w) >= n:
            prefix_counter[w[:n]] += 1
            suffix_counter[w[-n:]] += 1

for p, cnt in prefix_counter.items():
    entries.append((f"pref:{p}", cnt))

for s, cnt in suffix_counter.items():
    entries.append((f"suff:{s}", cnt))

print(f"Total count entries generated: {len(entries)}")

with open("migrations/0003_word_counts.sql", "w", encoding="utf-8") as f:
    f.write("-- Migration 0003: Precomputed word counts for zero-read count queries\n")
    f.write("CREATE TABLE IF NOT EXISTS word_counts (\n")
    f.write("    key TEXT PRIMARY KEY,\n")
    f.write("    count INTEGER NOT NULL\n")
    f.write(");\n\n")
    
    chunk_size = 500
    for i in range(0, len(entries), chunk_size):
        chunk = entries[i:i+chunk_size]
        vals = ", ".join(f"('{k}', {cnt})" for k, cnt in chunk)
        f.write(f"INSERT OR REPLACE INTO word_counts (key, count) VALUES {vals};\n")

print("Wrote migrations/0003_word_counts.sql successfully!")

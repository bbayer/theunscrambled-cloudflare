import sqlite3
import os

legacy_db_path = r"C:\Users\bayer\Downloads\bbayer-theunscrambled-3f8a701dd64f\app\words_static.db"
local_d1_path = r"C:\Users\bayer\Documents\GitHub\theunscrambled-cloudflare\.wrangler\state\v3\d1\miniflare-D1DatabaseObject\e7753343ef35f82e8d6b28b01e856201a9f0b91bbab699c2dbd8b4f7eb2e0700.sqlite"

print(f"Reading from {legacy_db_path}...")
src_conn = sqlite3.connect(legacy_db_path)
src_c = src_conn.cursor()

dst_conn = sqlite3.connect(local_d1_path)
dst_c = dst_conn.cursor()

print("Copying words from freq_map_en...")
src_c.execute("SELECT word FROM freq_map_en")
words = src_c.fetchall()
print(f"Total words to copy: {len(words)}")

dst_conn.execute("BEGIN TRANSACTION")
word_rows = []
for (w,) in words:
    if w:
        clean = w.lower().strip()
        sorted_l = "".join(sorted(clean))
        word_rows.append((clean, len(clean), sorted_l))

dst_c.executemany("INSERT OR IGNORE INTO words (word, length, sorted_letters) VALUES (?, ?, ?)", word_rows)
dst_conn.commit()
print("Words copied successfully.")

print("Copying anagrams...")
src_c.execute("SELECT anagram, data FROM anagrams")
anagrams = src_c.fetchall()
print(f"Total anagrams to copy: {len(anagrams)}")

dst_conn.execute("BEGIN TRANSACTION")
ana_rows = []
for ana, data in anagrams:
    if ana and data:
        ana_clean = ana.lower().strip()
        data_clean = data.lower().strip()
        ana_rows.append((ana_clean, data_clean))

dst_c.executemany("INSERT OR IGNORE INTO anagrams (anagram, data) VALUES (?, ?)", ana_rows)
dst_conn.commit()
print("Anagrams copied successfully.")

print("Copying synsets definitions...")
src_c.execute("SELECT word, syn, type, definition FROM synsets")
synsets = src_c.fetchall()
print(f"Total synsets to copy: {len(synsets)}")

dst_conn.execute("BEGIN TRANSACTION")
syn_rows = []
for word, syn, stype, defn in synsets:
    if word and defn:
        syn_rows.append((word.lower().strip(), syn, stype, defn))

dst_c.executemany("INSERT INTO synsets (word, syn, type, definition) VALUES (?, ?, ?, ?)", syn_rows)
dst_conn.commit()
print("Synsets copied successfully.")

# Verification
dst_c.execute("SELECT count(*) FROM words")
print("Total words in local D1:", dst_c.fetchone()[0])
dst_c.execute("SELECT count(*) FROM anagrams")
print("Total anagrams in local D1:", dst_c.fetchone()[0])
dst_c.execute("SELECT count(*) FROM synsets")
print("Total synsets in local D1:", dst_c.fetchone()[0])

import sqlite3
import os

legacy_db = r"C:\Users\bayer\Downloads\bbayer-theunscrambled-3f8a701dd64f\app\words_static.db"
conn = sqlite3.connect(legacy_db)
c = conn.cursor()

sample_words = c.execute("SELECT word FROM freq_map_en LIMIT 2000").fetchall()
sample_anas = c.execute("SELECT anagram, data FROM anagrams LIMIT 2000").fetchall()

os.makedirs("migrations", exist_ok=True)
with open("migrations/sample_seed.sql", "w", encoding="utf-8") as f:
    for (w,) in sample_words:
        if w:
            clean = w.lower().strip().replace("'", "''")
            letters = "".join(sorted(clean))
            f.write(f"INSERT OR IGNORE INTO words (word, length, sorted_letters) VALUES ('{clean}', {len(clean)}, '{letters}');\n")
    for ana, data in sample_anas:
        if ana and data:
            ana_clean = ana.lower().strip().replace("'", "''")
            data_clean = data.lower().strip().replace("'", "''")
            f.write(f"INSERT OR IGNORE INTO anagrams (anagram, data) VALUES ('{ana_clean}', '{data_clean}');\n")

print("migrations/sample_seed.sql generated successfully")

import sqlite3
import os
import sys

"""
Script to export data from legacy words_static.db into D1-compatible SQL statements.
"""

LEGACY_DB = r"C:\Users\bayer\Downloads\bbayer-theunscrambled-3f8a701dd64f\app\words_static.db"
OUTPUT_DIR = "migrations_data"

def main():
    if not os.path.exists(LEGACY_DB):
        print(f"Error: {LEGACY_DB} not found")
        sys.exit(1)

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    conn = sqlite3.connect(LEGACY_DB)
    c = conn.cursor()

    print("Extracting words from freq_map_en...")
    c.execute("SELECT word FROM freq_map_en")
    words = c.fetchall()
    print(f"Total words: {len(words)}")

    # 1. Export words in batches of 1000
    batch_size = 1000
    file_idx = 1
    out_file = open(os.path.join(OUTPUT_DIR, f"words_{file_idx:03d}.sql"), "w", encoding="utf-8")
    
    for i, (w,) in enumerate(words):
        if not w:
            continue
        clean = w.lower().strip()
        sorted_letters = "".join(sorted(clean))
        clean_escaped = clean.replace("'", "''")
        sorted_escaped = sorted_letters.replace("'", "''")
        out_file.write(f"INSERT OR IGNORE INTO words (word, length, sorted_letters) VALUES ('{clean_escaped}', {len(clean)}, '{sorted_escaped}');\n")
        
        if (i + 1) % 25000 == 0:
            out_file.close()
            file_idx += 1
            out_file = open(os.path.join(OUTPUT_DIR, f"words_{file_idx:03d}.sql"), "w", encoding="utf-8")

    out_file.close()
    print(f"Words export completed. Total files: {file_idx}")

    # 2. Export anagrams
    print("Extracting anagrams...")
    c.execute("SELECT anagram, data FROM anagrams")
    anagrams = c.fetchall()
    print(f"Total anagram keys: {len(anagrams)}")

    file_idx = 1
    out_file = open(os.path.join(OUTPUT_DIR, f"anagrams_{file_idx:03d}.sql"), "w", encoding="utf-8")

    for i, (ana, data) in enumerate(anagrams):
        if not ana or not data:
            continue
        ana_esc = ana.lower().strip().replace("'", "''")
        data_esc = data.lower().strip().replace("'", "''")
        out_file.write(f"INSERT OR IGNORE INTO anagrams (anagram, data) VALUES ('{ana_esc}', '{data_esc}');\n")

        if (i + 1) % 25000 == 0:
            out_file.close()
            file_idx += 1
            out_file = open(os.path.join(OUTPUT_DIR, f"anagrams_{file_idx:03d}.sql"), "w", encoding="utf-8")

    out_file.close()
    print(f"Anagrams export completed. Total files: {file_idx}")

if __name__ == "__main__":
    main()

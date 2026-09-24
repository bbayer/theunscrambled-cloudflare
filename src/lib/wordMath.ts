export const SCRABBLE_SCORES: Record<string, number> = {
  a: 1, b: 3, c: 3, d: 2, e: 1, f: 4, g: 2, h: 4, i: 1, j: 8,
  k: 5, l: 1, m: 3, n: 1, o: 1, p: 3, q: 10, r: 1, s: 1, t: 1,
  u: 1, v: 4, w: 4, x: 8, y: 4, z: 10
};

export function calcScrabbleScore(word: string): number {
  let score = 0;
  const clean = word.toLowerCase();
  for (let i = 0; i < clean.length; i++) {
    score += SCRABBLE_SCORES[clean[i]] || 0;
  }
  return score;
}

export function sortWord(word: string): string {
  return word.toLowerCase().split('').sort().join('');
}

export function cleanRack(rack: string): string {
  return rack.toLowerCase().replace(/[^a-z]/g, '');
}

/**
 * Generates all unique sorted letter combinations from a sorted rack string
 * for lengths between minLength and rack.length.
 */
export function getRackCombinations(sortedRack: string, minLength: number = 2): string[] {
  const results = new Set<string>();

  function backtrack(start: number, current: string) {
    if (current.length >= minLength) {
      results.add(current);
    }
    if (current.length === sortedRack.length) {
      return;
    }

    for (let i = start; i < sortedRack.length; i++) {
      backtrack(i + 1, current + sortedRack[i]);
    }
  }

  backtrack(0, "");
  return Array.from(results);
}

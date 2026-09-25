/**
 * Precomputed static word counts to eliminate full-table scans (D1 row reads).
 * Since the lexicon dictionary is static, returning these precomputed counts
 * reduces row reads from 178,691 per request down to ZERO.
 */

export const STATIC_LENGTH_COUNTS: Record<number, number> = {
  2: 101,
  3: 1015,
  4: 4030,
  5: 8938,
  6: 15788,
  7: 24029,
  8: 29766,
  9: 29150,
  10: 22326,
  11: 16165,
  12: 11417,
  13: 7750,
  14: 5059,
  15: 3157,
};

export const STATIC_LETTER_COUNTS: Record<string, number> = {
  a: 10771,
  b: 9973,
  c: 16588,
  d: 10402,
  e: 7184,
  f: 7138,
  g: 5874,
  h: 6498,
  i: 6628,
  j: 1480,
  k: 1857,
  l: 5317,
  m: 9949,
  n: 4454,
  o: 6057,
  p: 15066,
  q: 850,
  r: 10518,
  s: 19732,
  t: 9000,
  u: 5231,
  v: 2859,
  w: 3922,
  x: 152,
  y: 590,
  z: 601,
};

export const STATIC_PREFIX_COUNTS: Record<string, number> = {
  un: 4012,
  re: 6886,
  in: 4208,
  dis: 1655,
  pre: 1881,
  non: 1475,
  anti: 704,
  mis: 1250,
  de: 3788,
  sub: 1077,
  over: 1643,
  out: 1439,
};

export const STATIC_SUFFIX_COUNTS: Record<string, number> = {
  ing: 13015,
  ed: 14055,
  er: 7908,
  est: 1897,
  ly: 6292,
  tion: 2376,
  able: 1612,
  ness: 2806,
  ful: 348,
  less: 740,
  ment: 606,
  ity: 1455,
  es: 22573,
  s: 66736,
};

/**
 * Calculates the next alphabetical string for B-tree range scanning.
 * e.g. "un" -> "uo", "a" -> "b", "dis" -> "dit"
 */
export function getNextPrefix(prefix: string): string {
  if (!prefix) return "";
  const lastChar = prefix[prefix.length - 1];
  const nextChar = String.fromCharCode(lastChar.charCodeAt(0) + 1);
  return prefix.slice(0, -1) + nextChar;
}

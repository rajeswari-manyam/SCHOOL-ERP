// Small Levenshtein-distance "did you mean" helper — used to catch likely
// typos (e.g. "Accountent" vs "Accountant", "Telgu" vs "Telugu") that are
// close enough to a known/existing value to probably be a mistake, without
// blocking genuinely different values that just happen to be short strings.
export function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp: number[] = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    let prevDiagonal = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const temp = dp[j];
      dp[j] = a[i - 1] === b[j - 1]
        ? prevDiagonal
        : 1 + Math.min(prevDiagonal, dp[j], dp[j - 1]);
      prevDiagonal = temp;
    }
  }
  return dp[n];
}

/**
 * Finds the closest candidate to `value` (case-insensitive, trimmed) that's
 * within `maxDistance` edits but NOT an exact match — i.e. a likely typo of
 * an existing/known value. Returns null when `value` already matches a
 * candidate exactly, or when nothing is close enough to be a probable typo.
 */
export function findLikelyTypoOf(
  value: string,
  candidates: string[],
  maxDistance = 2
): string | null {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;

  let best: { candidate: string; distance: number } | null = null;
  for (const candidate of candidates) {
    const candidateNormalized = candidate.trim().toLowerCase();
    if (candidateNormalized === normalized) return null; // exact match — not a typo
    // Skip pairs too different in length to plausibly be a typo of each
    // other — keeps very short unrelated strings from matching by accident.
    if (Math.abs(candidateNormalized.length - normalized.length) > maxDistance) continue;
    const distance = levenshteinDistance(normalized, candidateNormalized);
    if (distance <= maxDistance && (!best || distance < best.distance)) {
      best = { candidate, distance };
    }
  }
  return best?.candidate ?? null;
}

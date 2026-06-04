/**
 * Returns the integer number of years that have elapsed since `from`.
 * Anniversaries that haven't happened yet this calendar year don't count —
 * so on 1 Jan, the church is still its old age until its founding date passes.
 *
 *   yearsSince(new Date('1993-11-21'))   // → 32  on 5 May 2026
 *   yearsSince(new Date('1993-11-21'))   // → 33  on 21 Nov 2026 onward
 *
 * Pure function (not a hook) — wrap in useMemo if you need it stable across
 * renders.
 */
export function yearsSince(from, now = new Date()) {
  const start = from instanceof Date ? from : new Date(from);
  if (Number.isNaN(start.getTime())) return 0;

  let years = now.getFullYear() - start.getFullYear();

  const beforeAnniversary =
    now.getMonth() < start.getMonth() ||
    (now.getMonth() === start.getMonth() && now.getDate() < start.getDate());

  if (beforeAnniversary) years -= 1;
  return Math.max(0, years);
}

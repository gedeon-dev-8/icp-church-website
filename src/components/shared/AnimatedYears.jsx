import { useMemo } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useCountUp } from '../../hooks/useCountUp';

// Single source of truth for ICP's founding year.
export const FOUNDING_YEAR = 1993;

// Other church-life anniversaries — bump these here and the matching
// AnimatedYears tile updates everywhere it's mounted.
//
// FOUNDER_YEAR  → tenure of Rev. Pastor Emmanuel Tshilenga Kabala.
// STREAMING_SINCE → first online sermon broadcast (used in stats /
//                   "years streaming online" copy).
export const FOUNDER_YEAR    = 1993;
export const STREAMING_SINCE = 2022;

/**
 * Renders the number of completed years between a `since` year and the
 * current calendar year, with:
 *   1. Auto-update — flips on 1 January every year.
 *   2. A 0 → target count-up animation when scrolled into view.
 *   3. prefers-reduced-motion support (jumps straight to the target).
 *
 * Props:
 *   since        Number — starting year. Defaults to FOUNDING_YEAR so the
 *                "Years of grace" usage continues to work without change.
 *   className    CSS class on the rendered <span>.
 *   durationMs   How long the count-up takes (defaults to 1.8s).
 *   ariaLabel    Optional override (e.g. "33 years of grace"). When
 *                omitted we render "<n> years".
 */
export default function AnimatedYears({
  since = FOUNDING_YEAR,
  className = '',
  durationMs = 1800,
  ariaLabel,
}) {
  const { ref, visible } = useScrollReveal();
  const target = useMemo(
    () => Math.max(0, new Date().getFullYear() - since),
    [since]
  );
  const value = useCountUp(target, { when: visible, duration: durationMs });

  return (
    <span
      ref={ref}
      className={className}
      aria-label={ariaLabel || `${target} years`}
    >
      {value}
    </span>
  );
}

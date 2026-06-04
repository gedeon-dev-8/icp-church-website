import { useEffect, useRef, useState } from 'react';

/**
 * Animates from `start` → `target` over `duration` ms once `when` becomes true.
 * Uses requestAnimationFrame with an ease-out-cubic curve.
 *
 *   const value = useCountUp(33, { when: visible });
 */
export function useCountUp(target, { duration = 1800, start = 0, when = true } = {}) {
  const [value, setValue] = useState(start);
  const startedRef = useRef(false);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!when || startedRef.current) return undefined;
    startedRef.current = true;

    // Honor reduced-motion: jump straight to the target.
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setValue(target);
      return undefined;
    }

    const t0 = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      setValue(Math.round(start + (target - start) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, [when, target, duration, start]);

  return value;
}

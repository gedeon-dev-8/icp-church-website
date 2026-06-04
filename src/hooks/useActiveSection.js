import { useEffect, useState } from 'react';

/**
 * Tracks which section is currently most visible in the viewport.
 * Returns the id of the active section, or '' if none is active.
 *
 * sectionIds: array of element ids to observe.
 * options: { rootMargin, threshold } passed to IntersectionObserver.
 */
export function useActiveSection(sectionIds, options = {}) {
  const [active, setActive] = useState('');

  useEffect(() => {
    if (!sectionIds || sectionIds.length === 0) {
      setActive('');
      return;
    }

    // Track each section's intersection ratio so we can pick the
    // most visible one when several are in view at once.
    const ratios = new Map();

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        // Pick the section with the highest ratio currently in view.
        let bestId = '';
        let bestRatio = 0;
        for (const [id, ratio] of ratios.entries()) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        // If nothing's intersecting, fall back to the first section that's
        // above-or-at the viewport top (handles stop-at-bottom-of-page).
        if (bestRatio === 0 && window.scrollY < 100) {
          bestId = sectionIds[0];
        }
        if (bestId) setActive(bestId);
      },
      {
        rootMargin: options.rootMargin || '-30% 0px -50% 0px',
        threshold: options.threshold || [0, 0.15, 0.35, 0.55, 0.75, 1],
      }
    );

    const elements = sectionIds
      .map(id => document.getElementById(id))
      .filter(Boolean);

    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionIds.join('|')]);

  return active;
}

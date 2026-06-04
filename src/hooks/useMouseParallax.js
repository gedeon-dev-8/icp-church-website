import { useEffect, useRef } from 'react';

/**
 * Attaches mouse-move listeners to a target element and updates CSS variables
 * --mx, --my, --cx, --cy on the same element. Layers can then bind their
 * transforms or background positions to those vars without React re-renders.
 *
 *   --mx, --my  → normalized [-1, 1] mouse offset from element center
 *   --cx, --cy  → mouse position as a percentage of the element (0-100)
 *
 * Disabled automatically on touch devices and for reduced-motion users.
 */
export function useMouseParallax() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Don't run on touch primary devices
    const isTouch = window.matchMedia('(hover: none)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || reduced) return;

    let frameId = 0;
    let pending = null;

    const apply = () => {
      if (!pending || !el) { frameId = 0; return; }
      const { x, y } = pending;
      const rect = el.getBoundingClientRect();
      const localX = x - rect.left;
      const localY = y - rect.top;
      const cx = (localX / rect.width)  * 100;
      const cy = (localY / rect.height) * 100;
      const mx = (cx / 50) - 1;  // -1 to 1
      const my = (cy / 50) - 1;
      el.style.setProperty('--mx', mx.toFixed(3));
      el.style.setProperty('--my', my.toFixed(3));
      el.style.setProperty('--cx', `${cx.toFixed(2)}%`);
      el.style.setProperty('--cy', `${cy.toFixed(2)}%`);
      pending = null;
      frameId = 0;
    };

    const onMove = (e) => {
      pending = { x: e.clientX, y: e.clientY };
      if (!frameId) frameId = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      el.style.setProperty('--mx', 0);
      el.style.setProperty('--my', 0);
    };

    el.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  return ref;
}

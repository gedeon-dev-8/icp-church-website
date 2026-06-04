import { useEffect, useState } from 'react';
import { LOGO_B64 } from '../../../assets/logo';
import './PageLoader.scss';

const SESSION_KEY = 'icp-loader-shown';

export default function PageLoader() {
  // Show only once per browser session — the splash should set tone, not nag.
  const [phase, setPhase] = useState(() => {
    if (typeof window === 'undefined') return 'idle';
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'idle';
    if (sessionStorage.getItem(SESSION_KEY)) return 'idle';
    return 'visible';
  });

  // Schedule the visible → exiting → idle transitions ONCE on mount.
  // (Empty dependency array on purpose: re-running this effect when phase
  //  changes would clear the very timers that drive the transition.)
  useEffect(() => {
    if (phase !== 'visible') return;
    const exitTimer = setTimeout(() => setPhase('exiting'), 1400);
    const doneTimer = setTimeout(() => {
      setPhase('idle');
      try { sessionStorage.setItem(SESSION_KEY, '1'); } catch (e) { /* ignore */ }
    }, 2100);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lock body scroll only while the loader is on screen.
  useEffect(() => {
    if (phase === 'idle') return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prevOverflow; };
  }, [phase]);

  if (phase === 'idle') return null;

  return (
    <div
      className={`page-loader page-loader--${phase}`}
      role="status"
      aria-live="polite"
      aria-label="Loading International Church of Pretoria"
    >
      <div className="page-loader__inner">
        <img
          src={LOGO_B64}
          alt=""
          className="page-loader__logo"
          aria-hidden="true"
        />
        <div className="page-loader__brand">
          <span className="page-loader__brand-mark">ICP</span>
          <span className="page-loader__brand-line" aria-hidden="true" />
          <span className="page-loader__brand-full">International Church of Pretoria</span>
        </div>
        <div className="page-loader__bar" aria-hidden="true">
          <div className="page-loader__bar-fill" />
        </div>
      </div>
    </div>
  );
}

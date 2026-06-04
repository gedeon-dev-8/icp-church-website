import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Handles scroll behavior across route changes:
 * - Route change without hash → scroll to top (instant for route swap, smooth for hash)
 * - Hash present → smooth-scroll to that element after the new page renders
 *
 * Also responsible for sending SPA-style page_view events to GA4 so
 * client-side navigations show up in analytics. The gtag bootstrap
 * lives in index.html; this just nudges it on every route change.
 */
export default function RouteScrollManager() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Wait one frame for the destination to render
      const id = window.requestAnimationFrame(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
      return () => window.cancelAnimationFrame(id);
    }
    // No hash: jump to top of new route
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }, [pathname, hash]);

  // ── Analytics: fire a page_view event on every route change. ──
  // The initial load is already tracked by the gtag('config', …) call
  // in index.html; this catches every subsequent SPA navigation.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const gaId = window.__GA_ID__;
    if (!gaId || gaId.indexOf('VITE_') !== -1) return; // GA not configured
    if (typeof window.gtag !== 'function') return;     // bootstrap not loaded

    const path = `${pathname}${search}${hash}`;
    window.gtag('event', 'page_view', {
      page_path:     path,
      page_location: window.location.href,
      page_title:    document.title,
    });
  }, [pathname, search, hash]);

  return null;
}

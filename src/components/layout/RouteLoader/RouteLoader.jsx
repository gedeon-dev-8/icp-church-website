import './RouteLoader.scss';

// ────────────────────────────────────────────────────────────────────
// RouteLoader — a lighter splash than PageLoader, shown by Suspense
// while a code-split route chunk is being fetched. Visually a thin
// progress bar slipping across the top of the viewport plus a centred
// pulsing logotype, so the brand feels continuous between routes.
//
// Render with: <Suspense fallback={<RouteLoader />}>{routes}</Suspense>
// ────────────────────────────────────────────────────────────────────
export default function RouteLoader() {
  return (
    <div
      className="route-loader"
      role="status"
      aria-live="polite"
      aria-label="Loading next page"
    >
      <div className="route-loader__bar" aria-hidden="true">
        <div className="route-loader__bar-fill" />
      </div>
      <div className="route-loader__mark" aria-hidden="true">
        <span className="route-loader__mark-text">ICP</span>
      </div>
    </div>
  );
}

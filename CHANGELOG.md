# Changelog

All notable changes to the ICP website are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project aims to use [Semantic Versioning](https://semver.org/) once it's tagged on GitHub.

---

## [Unreleased]

Changes staged but not yet tagged.

---

## [1.0.0] — Initial public release

The first version of the site, ready for deployment to `icpretoria.org`.

### Added

#### Pages and routes
- `/` — editorial home page (Hero, Ticker, About, Stats, Announcement, Sermons, Events, Gallery preview, Scripture, Map)
- `/departments` — ministry directory with schedule and CTA band
- `/gallery` — Memory Lane sepia opener + category-grouped photo archive with jump-nav, lightbox, video tile
- `*` — designed `NotFound` 404 page with quick links

#### Components and layout
- **Hero** with rotating 4-image carousel (Ken Burns + scroll parallax), live countdown to next Sunday service in Africa/Johannesburg time, word-stagger animated title
- **Ticker** — slow horizontal marquee of weekly rhythms
- **About** with editorial pull-quote and 30-year animated badge
- **Stats** band — count-up numbers anchored to real data (years, departments, sermons, photos)
- **Announcement** — weekly gatherings + cell-group locations
- **Sermons** — three latest cards, titles + thumbnails live from YouTube oEmbed
- **Events** — annual recurring services (Women's Day, Christmas, NYE) with auto-rolling dates
- **Gallery** (home) — bento grid with collection deep-links, marquee, video tile
- **Scripture** — verse-of-the-year highlight
- **Map** with Google Maps embed, offline fallback, contact info strip
- **Memory Lane** — vintage sepia slideshow of early-era photos
- **PageLoader** + **RouteLoader** — first-load splash and code-split route transition loaders
- **NextServiceBanner** — slides in from above the nav Wed afternoon → Sun morning, dismissible per service window
- **BackToTop** floating button
- **Divider** with five glyph variants (star, cross, gem, fire, dove)
- **EmptyState** — branded "nothing here" / error component reused across Sermons, Gallery, NotFound, Contact form

#### Cross-cutting
- **Bilingual** EN + FR via `LanguageContext`; every visible string passes through `translations.js`
- **Dark / light** theme toggle, persists in localStorage
- **Liturgical season** auto-detection (Advent, Christmas, Epiphany, Lent, Easter, Pentecost, Ordinary) with subtle palette shifts per season
- **Font Awesome** as the site-wide icon system (solid + brands)
- **Scroll-reveal** observer hook with shared base mixin
- **Photo warmth** mixin — unified `brightness + saturate + sepia` filter across all gallery imagery
- **Lazy gallery chapters** — IntersectionObserver-driven mounting so the page stays light no matter how the archive grows

#### Tech and SEO
- React 18 + React Router 7 + Vite 5 + SCSS
- Code-split routes via `React.lazy` + `Suspense`
- JSON-LD `Church` structured data
- Open Graph + Twitter Cards meta with auto-generated 1200×630 JPG (from `og-image.svg` via Sharp)
- Full PWA manifest + favicon set
- `<noscript>` fallback exposing address and service time
- Google Analytics 4 bootstrap with SPA route-change tracking (opt-in via env var)
- Contact form wired to Formspree / Web3Forms compatible endpoint, mailto fallback when unset

### Fixed
- 404 wildcard route no longer renders Home (was an SEO duplicate-content hazard)
- Mobile menu social URLs synced with Footer (no more placeholder `facebook.com/` links)
- Theme toggle icons unified to FontAwesome across Navbar + MobileMenu
- Favicon paths corrected for Vite (`%PUBLIC_URL%` was a CRA leftover and broke every icon link)
- Web manifest icon paths fixed to point at the `favicon/` subfolder
- Sermon `__title` no longer leaks the speaker name (oEmbed sometimes embeds it); curated translation title now drives the heading, oEmbed only drives the thumbnail
- Gallery YearPill links restored (now category-based with proper `#category-…` anchors)
- Hero countdown now reacts to day-flip — a tab left open through Sunday rolls forward to the next week
- Service countdown locked to Africa/Johannesburg regardless of visitor timezone

### Removed
- `@fortawesome/free-regular-svg-icons` (unused)
- `sass-loader` (webpack leftover; Vite uses `sass` directly)
- Commented-out inline SVGs in Footer (now uses FA brand icons)
- 19 named hero image imports (replaced by `import.meta.glob`)
- Year-themed gallery scaffolding (`YearPill`, `YearStrip`, `pickByYearPrefix`) — superseded by category-based grouping

---

## How to update this changelog

When you ship a change worth recording:

1. Add it under `[Unreleased]` at the top, in the right section (`Added`, `Changed`, `Fixed`, `Removed`, `Security`, `Deprecated`).
2. When you tag a release, rename `[Unreleased]` to `[X.Y.Z] — YYYY-MM-DD`, and start a fresh `[Unreleased]` block above it.
3. Write entries from the user's perspective. "Replaced wildcard route with NotFound" — not "modified App.jsx routes".

Small or routine commits (bumping a single sermon ID, fixing a typo) don't need a changelog entry.

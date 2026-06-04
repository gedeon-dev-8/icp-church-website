# Architecture

A technical orientation for new developers joining the codebase. This document explains how the pieces fit together and what conventions to follow.

---

## Stack summary

```
React 18  +  React Router 7  +  Vite 5  +  SCSS  +  Font Awesome
```

That's it. No state library, no CSS-in-JS, no GraphQL, no SSR. The site is a content-heavy SPA with strong typographic identity and editorial pacing — none of which benefits from heavier framework choices.

---

## Mental model

The app is a tree of three concerns:

1. **Providers** — `ThemeProvider`, `LanguageProvider`. They set the visual mode and the language; everything below reads from them.
2. **Layout chrome** — `Navbar`, `Footer`, `BackToTop`, `RouteScrollManager`, `PageLoader`, `RouteLoader`, `NextServiceBanner`. These sit outside any route.
3. **Routes** — `Home`, `DepartmentsPage`, `GalleryPage`, `NotFound`. Each route renders a tree of section components.

```
<ThemeProvider>
  <LanguageProvider>
    <PageLoader />              ← first-load splash
    <BrowserRouter>
      <RouteScrollManager />    ← scroll + analytics on route change
      <NextServiceBanner />     ← Wed–Sun nudge banner
      <Navbar />
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route … />
        </Routes>
      </Suspense>
      <Footer />
      <BackToTop />
    </BrowserRouter>
  </LanguageProvider>
</ThemeProvider>
```

The heavy routes (`GalleryPage`, `DepartmentsPage`, `NotFound`) are code-split via `React.lazy`. Home is eager because it's the entry point.

---

## State management

There is no Redux / Zustand / Jotai. Three small contexts cover everything:

- **`LanguageContext`** (`src/context/LanguageContext.jsx`) — exposes `{ lang, setLang, toggleLang, t }`. `t('section.key')` is the universal translator. Falls back to the key string if a translation is missing.
- **`ThemeContext`** (`src/context/ThemeContext.jsx`) — exposes `{ theme, toggleTheme, season, setSeasonOverride }`. The active season is auto-detected from the calendar but can be overridden.
- Component-local `useState` for everything else (lightbox open, form values, banner dismissal).

If we ever need cross-route state (cart, login session, multi-step booking), introduce one focused store — don't reach for Redux on day one.

---

## Routing

`react-router-dom@7` with `BrowserRouter`. Three routes:

| Path | Component | Loading |
|---|---|---|
| `/` | `Home` | Eager |
| `/departments` | `DepartmentsPage` | Lazy chunk |
| `/gallery` | `GalleryPage` | Lazy chunk |
| `*` | `NotFound` | Lazy chunk |

`RouteScrollManager` does two things on every navigation:

1. Scroll to top, or smooth-scroll to a hash anchor if present.
2. Fire a Google Analytics `page_view` event (no-op when GA isn't configured).

Deep-linking into the gallery uses `#category-<slug>` anchors — `RouteScrollManager` handles the post-mount scroll.

---

## Internationalisation

Implemented inline. No `react-i18next` — overkill for this size.

`src/i18n/translations.js` exports `{ en, fr }`. The `t()` function in `LanguageContext` does a dotted-path lookup:

```js
t('hero.titleAccent')  // → "Pictures" (en) or "Images" (fr)
```

It returns:

- A string if the path resolves to a string
- The original object if the path resolves to an object (e.g. `t('sermons.items')` returns the array)
- The original key as a fallback if the path is missing — never `undefined`

To add a new language, see [`CONTENT_GUIDE.md`](./CONTENT_GUIDE.md#adding-a-new-language).

---

## Theming

Two orthogonal axes:

### Dark / light

CSS custom properties on `<html data-theme="dark">` (or `light`). Every colour reference in SCSS uses a token (`var(--cyan)`, `var(--bg)`, `var(--text)`) — never a hex. Theme toggle persists in `localStorage`.

### Liturgical season

A second attribute `<html data-season="advent">` (or `christmas`, `epiphany`, `lent`, `easter`, `pentecost`, `ordinary`). Auto-detected by `src/lib/liturgicalSeason.js` using the Anonymous Gregorian (Meeus / Jones / Butcher) algorithm for Easter and derived moveable dates.

The seasonal palette only shifts accents — `--cyan`, `--gold`, `--cyan-dim`, `--gold-dim`. The base palette is preserved so nothing breaks unexpectedly. See `[data-season='…']` blocks in `_variables.scss`.

Visitors can manually override via the context: `setSeasonOverride('easter')`. We don't expose a UI for this yet but it's there for admins.

---

## SCSS architecture

```
src/styles/
├── global.scss        ← imports fonts, resets, grain overlay, focus rings
├── _variables.scss    ← palette tokens, breakpoints, fonts, seasons
└── _mixins.scss       ← reveal-base, eyebrow, section-title, photo-warmth, btn-primary, btn-ghost
```

Each component owns its sibling `.scss` file and `@use 'variables' as *;` at the top. We don't have nested partials inside component folders — the partials are SCSS plumbing only.

**BEM-ish naming**: `.section`, `.section__element`, `.section--modifier`. The double-underscore separates the parent name from the child to keep selectors readable.

**The photo-warmth mixin** is the unifier for the gallery. Any `<img>` that should feel "ICP-photographed" gets `@include photo-warmth($brightness)` — a coordinated `brightness + saturate + contrast + sepia` filter.

---

## Custom hooks

Located in `src/hooks/`. Each one solves a small, reusable problem:

| Hook | What it does |
|---|---|
| `useScrollReveal` | Returns `{ ref, visible }` — fires on IntersectionObserver. Backbone of every fade-in. |
| `useNavScroll` | Returns whether the user has scrolled past a threshold (used by the navbar shadow). |
| `useActiveSection` | Observes a list of section IDs and returns the most-visible one — drives navbar active states. |
| `useCountdown` | Live countdown to a target Date, ticks every minute. Returns `{ days, hours, minutes, isLive, isStartingSoon }`. |
| `useNextSundayService` | Wraps `getNextSundayService` and rolls forward when the previous service has passed. |
| `useCountUp` | Animates 0 → target over N ms when scrolled into view. Respects `prefers-reduced-motion`. |
| `useMouseParallax` | Maps mouse position to CSS custom properties on a ref. |
| `useYouTubeMeta` | Fetches a video's title + thumbnail via `noembed.com` (CORS-friendly oEmbed proxy). |
| `useYearsSince` | Returns calendar-years from a start year. Simpler than `useCountUp` for cases without animation. |

If you find yourself writing the same `useEffect` + `useState` pattern in two places, extract a hook here.

---

## Data flow

The site is content-driven. There's effectively one data file (`translations.js`) and one image pipeline (`src/assets/images/`). All UI components read from one of these.

### Translations

Components call `useLang()` and then `t('section.path.to.key')`. The translation function is the read interface. There is no write interface (yet — that's the CMS roadmap item).

### Images

We use Vite's `import.meta.glob` extensively:

```js
// Eager — emit URLs inline. Used for hero, gallery, memory lane.
const modules = import.meta.glob('../path/**/*.{jpg,png}', {
  eager: true,
  import: 'default',
});

// Returns: { './path/foo.jpg': '/assets/foo.hashed.jpg', … }
```

With `eager: true`, Vite emits a map of paths → hashed URL strings at build time. The actual image binaries are emitted as separate hashed assets that the browser fetches lazily via `<img loading="lazy">`.

For the gallery, we also use `LazyChapter` (an `IntersectionObserver` wrapper) to defer mounting heavy DOM until the chapter scrolls into view — important as the archive grows.

---

## Build pipeline

```
npm run build
  ↓
  npm run og              ← Sharp renders og-image.svg → JPG + PNG
  ↓
  vite build              ← bundles src/ → dist/
                            • JS code-split per lazy route
                            • CSS extracted to hashed files
                            • images emitted to /assets/ with hash filenames
                            • index.html updated with hashed asset paths
                            • env vars substituted (%VITE_*%)
```

The `og` step writes into `public/`. Vite copies `public/` verbatim into `dist/`, so the rasterised OG image lands in the deploy without further work.

---

## Performance posture

The site does the obvious things:

- Code-splits the heavy routes
- Lazy-loads images at the browser level (`loading="lazy"`)
- Defers chapter DOM mounting in the gallery (`LazyChapter`)
- Uses `requestAnimationFrame` for scroll-driven values (not raw scroll listeners)
- Honours `prefers-reduced-motion` for all animations
- Preconnects to Google Fonts in the HTML head

What we don't (yet) do:

- Image format negotiation (no `<picture>` with WebP/AVIF). Adding `vite-imagetools` would auto-generate modern formats — worthwhile when the gallery hits 500+ photos.
- Service worker / true PWA — manifest is there, but we don't ship a SW. Easy to add via Workbox or `vite-plugin-pwa`.
- HTML pre-rendering — for SEO of routes other than `/`, a build step that crawls and emits static HTML would help. Crawlers do execute JS now but pre-rendered HTML is still faster to index.

---

## Security and privacy

- No localStorage / sessionStorage of personal data — only theme preference and a per-service-window dismissal flag for the next-service banner.
- IP anonymisation is on for Google Analytics (`anonymize_ip: true`).
- Contact form submissions go directly to Formspree / Web3Forms (or a `mailto:` fallback). We don't proxy them through our own server.
- All third-party assets (Google Fonts, gtag.js, noembed.com) are loaded over HTTPS.
- No user-generated content surface anywhere on the site — nothing to sanitise.

If we add a member portal, prayer wall, or any input that displays back to other users, we'll need to revisit XSS hygiene.

---

## Where to start when debugging

| Symptom | First place to look |
|---|---|
| String didn't update | `src/i18n/translations.js` — was the FR side updated too? |
| New photo not showing | `Gallery-Page-Images/` — is the file extension supported (`.jpg/.jpeg/.png/.webp`)? |
| Layout broken in light mode | `_variables.scss` `[data-theme='light']` block — is the right CSS var set? |
| Section doesn't fade in | Did you wrap with `<Reveal>` or attach `useScrollReveal()`? |
| Route doesn't exist after navigation | `App.jsx` — is the route registered? Did you forget to wrap in `<Suspense>`? |
| Date / countdown wrong | `useCountdown.js` — verify the timezone helper logic, not the visitor's clock |
| YouTube thumbnail missing | `useYouTubeMeta.js` — is `noembed.com` reachable? Browser DevTools → Network → search `noembed` |
| OG image preview is stale | `public/og-image.svg` was updated but `npm run og` wasn't run before the deploy |
| Translation switches but page doesn't update | A component is reading a translation outside React render — likely a `const X = t('…')` at module scope. Move inside the component. |

---

## Code review checklist

When reviewing a PR, the questions worth asking:

- Does the change touch both `en` and `fr` if it's copy?
- Does it look right in dark **and** light mode?
- Is there a comment explaining anything non-obvious?
- Are new tokens added to `_variables.scss` or hardcoded?
- If a hook was added, is it general enough to live in `src/hooks/`?
- Does the change respect `prefers-reduced-motion`?
- Is there a screenshot in the PR description for visual changes?

---

## Onward

If something here is no longer true (file moved, hook renamed, theme tokens reorganised), update this document in the same PR. The architecture only stays accurate if we keep it honest.

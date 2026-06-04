# Contributing to the ICP website

Thanks for taking an interest. The site is small enough that we keep things lightweight — but a few conventions make patches easier to review and history easier to read.

---

## Getting started

```bash
git clone <repo-url>
cd icp-website
npm install
cp .env.example .env
npm run dev
```

If you're editing copy only, you almost never need to touch JavaScript — most of what visitors read lives in `src/i18n/translations.js`. See [`docs/CONTENT_GUIDE.md`](./docs/CONTENT_GUIDE.md).

---

## Branching

We follow a simplified Gitflow:

| Branch | Purpose |
|---|---|
| `main` | Production. Every commit is deployable. Tagged at releases. |
| `develop` *(optional)* | Integration branch for upcoming releases. |
| `feature/<slug>` | New features (`feature/give-page`, `feature/prayer-form`) |
| `fix/<slug>` | Bug fixes (`fix/mobile-menu-overlap`) |
| `content/<slug>` | Copy / image-only changes (`content/november-announcement`) |

Branch off `main` (or `develop` if used), open a PR back into the same.

---

## Commit messages

We follow a relaxed version of [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <short summary>

<optional body explaining the why>
```

Common `type`s:

| Type | When to use |
|---|---|
| `feat` | A new feature or section |
| `fix` | A bug fix |
| `style` | Visual / SCSS-only changes |
| `copy` | Translation or text-only edits |
| `refactor` | Code reorganisation, no behaviour change |
| `perf` | Performance improvement |
| `chore` | Tooling, build, dependencies |
| `docs` | Markdown / comments only |

Examples:

```
feat: add Give page with EFT details and Yoco QR
fix: countdown banner overlapping navbar on iOS Safari
copy: translate sermon 4 into French
refactor: extract YouTubeMeta hook from Sermons component
```

Keep the subject line under ~70 characters. The body is optional but useful for non-obvious changes.

---

## Pull requests

A good PR:

- **Has a clear title** — same shape as a commit message
- **Describes what changed and why** — even one paragraph is fine
- **Includes a screenshot or screen recording** if anything visual changed
- **Calls out anything risky** — translations affecting both EN and FR, env vars added, dependencies bumped
- **Notes any follow-up items** if work is intentionally left for a later PR

We use [`.github/PULL_REQUEST_TEMPLATE.md`](./.github/PULL_REQUEST_TEMPLATE.md) as a starting prompt.

### Review

Right now reviews are informal and quick. As the team grows we'll add:

- At least one approving review before merge
- Build must pass (Vite build + lint when set up)
- No merge during a Sunday service window — keep prod stable when it matters

---

## Coding style

### JavaScript / JSX

- Functional components only — no classes.
- Prefer named imports (`import { useState } from 'react'`).
- Hooks live in `src/hooks/`. Reuse before inventing.
- Avoid inline arrow functions inside JSX when a stable reference matters (e.g. `useCallback` for handlers passed into memoised children).
- Comments explain **why**, not **what** — assume the reader can read JavaScript.
- Strict equality (`===`) always.
- Async logic uses `async/await`, not raw `.then()` chains.

### SCSS

- BEM-ish class naming (`.section`, `.section__element`, `.section--modifier`).
- Tokens (colours, spacing, breakpoints) come from `_variables.scss` — don't hardcode hex.
- Reusable patterns go in `_mixins.scss`. Don't duplicate.
- Section styles live next to their component in a sibling `.scss` file with `@use`.
- Light/dark variants use the CSS custom properties from `_variables.scss`; never write a hex inside a `[data-theme='…']` selector.

### File naming

- React components: `PascalCase.jsx` (e.g. `EmptyState.jsx`)
- Hooks: `useCamelCase.js`
- SCSS partials: `_kebab-case.scss` with leading underscore
- Everything else: `kebab-case.js` (`liturgical-season.js`)

---

## Translations

We support EN and FR. Any time you add or edit a string in the English block of `translations.js`, **also update the French block**. Don't leave half-translated entries — visitors who switch language hit the gap immediately.

If a translation truly can't be provided (e.g. you're prototyping), mark it with `// TODO: FR` next to the line so it's findable later.

---

## Tests

We don't have a test suite yet. For now:

- Manually click through the section you changed on both desktop and a phone-sized viewport.
- Toggle dark/light theme and switch EN ↔ FR — visual layouts can break under either.
- If you changed routing or lazy loading, run `npm run build && npm run preview` and verify the production bundle behaves.

Adding Vitest + React Testing Library for critical paths (form submission, countdown logic) is on the roadmap.

---

## Asset hygiene

Photos are the largest part of the repo. Before adding new ones:

- Resize to a sensible max (1920px wide is plenty for full-bleed; 1200 for tiles).
- Run them through [Squoosh](https://squoosh.app/) or `sharp` for compression — a 4 MB iPhone shot should become a ~400 KB web JPG with no visible loss.
- Strip EXIF if it contains GPS / device info you don't want public.
- Name them descriptively when they live in `Home-Gallery-Images/` (the filename becomes the caption). Anywhere else, the original `IMG-…` or WhatsApp filenames are fine — the loader figures it out.

---

## Reporting issues

Open a GitHub issue with the templates under `.github/ISSUE_TEMPLATE/`. Include browser + OS, a screenshot if visual, and the URL.

For sensitive matters (private data exposed, security vulnerability, content takedown request), email the maintainers per [`SECURITY.md`](./SECURITY.md) — don't open a public issue.

---

## A note on tone

This is a church website. The code can be terse and technical; the copy that ships to visitors should be warm, welcoming, and clear. When you're editing strings, picture a first-time visitor with no church background landing on the page — would they feel invited?

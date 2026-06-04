# Deployment Guide

This document walks through getting the ICP website from a fresh clone to a production deploy. The site is a static SPA — no server, no database — so it can ship to almost any static host.

---

## Pre-flight checklist

Before you push to production, walk through this list. Each item takes under a minute.

- [ ] `git status` is clean — no uncommitted local hacks
- [ ] You're on the `main` branch
- [ ] `.env` has real values for `VITE_CONTACT_ENDPOINT` and `VITE_GA_MEASUREMENT_ID`
- [ ] You've clicked through the dev site once on both desktop and a phone-sized viewport
- [ ] Light mode + dark mode both look correct
- [ ] EN and FR both render without empty strings or fallbacks
- [ ] The contact form submits successfully (test with a real email address)
- [ ] `CHANGELOG.md` has an entry describing what's new
- [ ] `package.json` version was bumped if this is a tagged release

---

## Production build

```bash
# 1. Make sure all dependencies are installed
npm install

# 2. Build for production. This also regenerates og-image.jpg + .png.
npm run build

# 3. Sanity-check the build locally before deploying
npm run preview
```

`npm run build` produces:

```
dist/
├── assets/                  # Hashed JS, CSS, and image files
├── favicon/                 # Copied from /public
├── og-image.jpg             # Regenerated from og-image.svg
├── og-image.png             # Regenerated from og-image.svg
├── og-image.svg
└── index.html               # With env vars substituted
```

Deploy the entire `dist/` folder. The host serves `index.html` for any unknown path — SPA-style fallback.

---

## Host-specific setup

### Netlify

1. Connect your Git repo.
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables under Site Settings → Environment:
   - `VITE_CONTACT_ENDPOINT`
   - `VITE_GA_MEASUREMENT_ID`
5. Configure redirects for SPA routing — create `public/_redirects` with:
   ```
   /*  /index.html  200
   ```

### Vercel

1. Import the Git repo.
2. Framework preset: **Vite**
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add env vars under Project Settings → Environment Variables.
6. SPA fallback is handled automatically by Vercel.

### Cloudflare Pages

1. Connect Git, choose this repo.
2. Build command: `npm run build`
3. Build output directory: `dist`
4. Add env vars under Settings → Environment variables.
5. Create `public/_redirects` (same content as Netlify) for SPA fallback.

### Firebase Hosting

1. Install the Firebase CLI: `npm i -g firebase-tools`
2. `firebase init hosting` — choose `dist` as the public dir, configure as SPA (`yes` to rewrites).
3. Set env vars via your CI runner or commit a `.env.production` (never the secrets — those go in the runner).
4. Deploy: `firebase deploy --only hosting`

### Plain S3 + CloudFront

1. Create an S3 bucket, enable static website hosting.
2. Upload `dist/` contents.
3. Set the error document to `index.html` (or use CloudFront function for proper SPA rewrites).
4. Set up CloudFront distribution pointing at the bucket; cache-bust on each deploy.

---

## DNS

The structured data in `index.html` declares `https://icpretoria.org/` as the canonical URL. Make that real:

- Point the apex `icpretoria.org` at the host.
- 301-redirect `www.icpretoria.org` → `icpretoria.org` (or vice versa — pick one and stick with it).
- If the church owns other domains (`icpretoria.co.za`, historical short URLs), redirect them all to the canonical.

SSL is non-negotiable — every host above provides a free Let's Encrypt cert. Don't ship the site over plain HTTP.

---

## Environment variables on the host

The two variables you must set in production:

| Variable | Where to get it |
|---|---|
| `VITE_CONTACT_ENDPOINT` | https://formspree.io/forms — copy the JSON endpoint URL |
| `VITE_GA_MEASUREMENT_ID` | https://analytics.google.com → Admin → Data Streams → your web stream → Measurement ID (looks like `G-XXXXXXXXXX`) |

Vite injects these at **build time**, not runtime. That means:

- Setting them after a build does nothing — you must rebuild.
- They're embedded in the bundle as plain strings — never put secrets here.
- The contact endpoint URL is fine in the bundle; that's what Formspree/Web3Forms publish.

---

## First-deploy verification

Once the site is live, run through this checklist on the production URL:

- [ ] Home page loads under 3 seconds on a 4G connection
- [ ] Hero countdown shows the correct days/hours/minutes to next Sunday
- [ ] Contact form sends a test message; you receive it
- [ ] Both `/departments` and `/gallery` open from the nav
- [ ] Click an unknown URL (e.g. `/foo`) — should show the branded 404
- [ ] Open the page on a phone — banner doesn't overlap nav, photos load
- [ ] Switch to French — every section reads cleanly
- [ ] Switch to light mode — text contrast holds
- [ ] Share the URL on WhatsApp / a Slack — preview card shows the OG image and correct title
- [ ] Open the GA real-time view — your test session shows up
- [ ] Run [PageSpeed Insights](https://pagespeed.web.dev/) — Performance should be ≥85, SEO ≥95, Accessibility ≥95

If any of these fail, fix before announcing the launch.

---

## Rolling back

If a deploy goes badly:

- **Netlify / Vercel / Cloudflare** — click the previous successful deploy in the dashboard and "Restore" or "Promote". No CLI needed, no DNS change. Restore is usually live within 30 seconds.
- **Firebase** — `firebase hosting:clone <site>:live <site>:previous` to swap channels, or redeploy from the previous Git SHA.
- **Custom infra** — keep the previous `dist/` folder around as `dist-previous/` until the new one is verified, then atomically swap.

Tag the bad commit with a note in `CHANGELOG.md` under `[Unreleased]` so you remember what bit you.

---

## Post-launch hygiene

The site doesn't maintain itself but the maintenance burden is small:

- **Weekly** — bump the latest sermon's `youtubeId` in `translations.js`. Optionally update an announcement string.
- **Monthly** — drop new photos into `Gallery-Page-Images/<Category>/`. Update the "Theme of the Year" if it changed.
- **Quarterly** — bump dependencies: `npm outdated`, then `npm update` for minor versions. Major version bumps (especially React, Vite) go through a PR with manual smoke-testing.
- **Yearly** — confirm the founding year, sermon counts, and other anchored numbers are still accurate. They're constants in `AnimatedYears.jsx` and `Stats.jsx`.

---

## Common deploy issues

**The site builds but every page is blank.**
You're missing the SPA fallback. Configure your host to serve `index.html` for any 404. Check the host-specific section above.

**The contact form returns a 405 or CORS error.**
Your `VITE_CONTACT_ENDPOINT` is wrong, or your form provider hasn't whitelisted your domain. Verify the URL in your provider's dashboard.

**Google Analytics doesn't show any sessions.**
Either `VITE_GA_MEASUREMENT_ID` isn't set in your host's env vars, or you rebuilt after setting it but didn't redeploy. Confirm by viewing page source — search for the Measurement ID; if it shows up literally, you're good.

**OG previews look broken on WhatsApp / Slack.**
Most scrapers cache aggressively. Use Facebook's [Sharing Debugger](https://developers.facebook.com/tools/debug/) or LinkedIn's [Post Inspector](https://www.linkedin.com/post-inspector/) to force a refresh. Confirm `og-image.jpg` exists in `dist/`.

**Fonts flicker or load late.**
Cormorant Garamond / Cinzel / DM Sans come from Google Fonts via a `<link rel="preconnect">`. If your host has a strict CSP, ensure `fonts.googleapis.com` and `fonts.gstatic.com` are allowed.

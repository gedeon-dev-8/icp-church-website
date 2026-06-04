# Content Editor's Guide

A non-developer's guide to editing the ICP website. Most things you'd want to change live in a single file. The rest are folders you drop images into.

> If you've never used Git, ask the developer who set this up to either give you direct edit access via your host (Netlify / Vercel both have a web UI for `.md` and `.js` files) or to make edits on your behalf.

---

## Where copy lives

**Almost every visible word on the site is in one file:**

```
src/i18n/translations.js
```

Open it in any code editor (VS Code, Sublime, even Notepad++). The file is structured as two large blocks — English (`const en = { … }`) and French (`const fr = { … }`). Find the section you want to edit, change the string, save.

The file is **the single source of truth**. Once you edit a string and the site rebuilds, the change is live for every visitor.

---

## Common edits

### Update the weekly announcement

Find the `announcement` block. Each item under `groups[…].items` has:

```js
{
  id: 'sunday',
  icon: OPEN_BOOK_ICON,
  name: 'Sunday Service',
  when: 'Sundays · 09:00',
  extra: 'Doors open at 08:30',  // optional second line
}
```

Edit `name`, `when`, or `extra`. Save the file. Done.

### Swap a sermon

The latest three sermon cards on the home page are driven by `SERMON_REFS` near the top of `translations.js`:

```js
const SERMON_REFS = [
  { id: 's1', youtubeId: 'c2gIPYPCljo', thumbnail: YT_THUMB },
  { id: 's2', youtubeId: 'DhoPyTMcNgQ', thumbnail: YT_THUMB },
  { id: 's3', youtubeId: 'v-TdQEklXWM', thumbnail: YT_THUMB },
];
```

To swap in a new sermon:

1. Grab the YouTube video ID — it's the part of the URL after `?v=`. For `https://www.youtube.com/watch?v=abc123XYZ`, the ID is `abc123XYZ`.
2. Replace one of the `youtubeId` strings.
3. Update the matching English entry in `sermons.items`:

```js
{ title: 'NEW SERMON TITLE | REFERENCE', speaker: 'PAST. SOMEONE', date: 'November 24, 2026', duration: '1:45:12' },
```

4. Update the matching French entry in the FR block too — same shape, translated title.
5. Save. The thumbnail will be pulled live from YouTube; you don't need to edit it.

### Update the scripture / theme of the year

Find the `scripture` block. Edit `themeLabel`, `themeTitle`, the three `quote*` segments, and the `ref`. Same edits in EN and FR.

### Change a department's schedule

Find `departmentsPage.items[…]`. Each entry has a `schedule` string. Edit it.

### Add a new department

Copy an existing entry and edit. Make sure to add it in both `en` and `fr`. Pick an icon from the `import` block at the top of `translations.js` — the available glyphs are listed there (`OPEN_BOOK_ICON`, `SPROUT_ICON`, etc.).

### Edit the home page hero copy

Find the `hero` block. Common edits:

- `ctaPrimary` — the main button text ("Join Us Sunday")
- `next.time` — the displayed service time
- `next.cta` — the secondary button text

---

## Adding photos

Photos live in `src/assets/images/`. Different folders feed different parts of the site:

### Gallery archive (the `/gallery` page)

```
src/assets/images/Gallery-Page-Images/
├── ICP-Youth-Ministry/
├── ICP-Sports-Day/
├── ICP-Choir-Outing/
└── …
```

Drop JPGs / PNGs into the relevant subfolder. Any file in any subfolder gets picked up automatically. To create a new collection, just create a new subfolder (e.g. `ICP-Mens-Retreat/`) and drop photos in.

To make the new collection nicer-looking, add a matching entry under `galleryPage.categories` in `translations.js`:

```js
'ICP-Mens-Retreat': {
  title: 'Men\'s Retreat',
  eyebrow: 'Collection 07',
  shortLabel: 'Brotherhood',
  caption: 'A weekend away — fathers, sons, mentors.',
},
```

Without this, the page falls back to displaying the folder name with hyphens converted to spaces.

### Home bento

```
src/assets/images/Home-Gallery-Images/
```

Filenames double as captions:

- `Hands-&-Hearts.jpeg` becomes `HANDS & HEARTS`
- `A-Joyful-Noise.jpg` becomes `A JOYFUL NOISE`

Hyphens become spaces, the extension drops, everything uppercases. Drop a photo with the desired filename and it appears on the home page bento.

### Memory Lane (sepia opener on `/gallery`)

```
src/assets/images/Old-Images/
```

Drop early-era photos here. They auto-cycle in the sepia treatment. No naming convention required — order is alphabetical by filename.

### Hero carousel

```
src/assets/images/Hero-Images/
```

The home-page hero cycles through four curated images. The curation list is in `Hero.jsx`:

```js
const CURATED_FILENAMES = ['1.png', '2.jpeg', '6.jpeg', '11.jpeg'];
```

To swap an image, either:

- Replace one of those four files in `Hero-Images/` with a new photo using the same name, or
- Edit the array to point at a different filename.

---

## Photo prep tips

A great church photo on the web is **under 500 KB**, **no wider than 1920px**, and **stripped of EXIF data** (which can include GPS coordinates of where the photo was taken).

Use [Squoosh](https://squoosh.app/) — it runs in your browser, no install needed:

1. Drop the photo in.
2. Choose **MozJPEG** at quality 75–85.
3. Resize the longer edge to 1920 max (Squoosh has a resize panel on the right).
4. Download.
5. Drop into the appropriate folder above.

For phone photos, that turns a 4 MB iPhone shot into a ~300 KB web JPG with no visible loss.

---

## Adding a new language

ICP serves Pan-African members and might one day need Portuguese or Swahili. The pattern:

1. In `translations.js`, copy the entire `en = { … }` block and rename to e.g. `pt = { … }`. Translate every string.
2. Add the new language to `LanguageContext.jsx` so it's a valid choice.
3. Update the language toggle in the nav (`Navbar.jsx` + `MobileMenu.jsx`) to expose the new option.

Reach out to the developer for the last two steps if you're not comfortable editing JavaScript.

---

## What you should NOT edit without a developer

- Anything ending in `.scss` (styling files)
- Anything in `src/components/` (these are React components, not content)
- `package.json`, `vite.config.js`, `index.html`
- The `icon: ICON_NAME` lines in `translations.js` — those are icon references, not text

If you accidentally edit one of these, just don't save. If you've already saved, the developer can revert via Git.

---

## Previewing your changes

Before publishing edits to the production site, preview them locally:

```bash
npm run dev
```

Opens at `http://localhost:5173`. Every time you save `translations.js` the page reloads automatically with your changes.

If you don't have Node / npm installed, ask the developer to do a preview deploy of your branch — both Netlify and Vercel can give you a unique preview URL per branch.

---

## Publishing

Once you're happy with your changes:

1. `git add .`
2. `git commit -m "copy: update October announcement"`
3. `git push`

The host's automatic deploy will pick it up and ship within a couple of minutes. Refresh `icpretoria.org` to see the change live.

If anything looks wrong on production, just push another commit fixing it — there's no penalty for shipping multiple small edits.

---

## When something goes wrong

If you save a change and the site won't build (browser shows a Vite error, or the host fails the deploy), the most common cause is a missing comma or a stray quote in `translations.js`. Look at the line number in the error message — there's almost always an obvious culprit within a few lines.

If you're stuck, the change is still safe — your edits are in Git history, the previous version is still live until a new deploy succeeds.

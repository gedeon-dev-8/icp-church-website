// ──────────────────────────────────────────────────────────────────
// Loads every image and video inside the curated
// /assets/images/Gallery-Page-Images/<Category>/ folders and groups
// them by the parent folder name.
//
// Folder layout it expects:
//   Gallery-Page-Images/
//     ICP-Youth-Ministry/<any image or video>
//     ICP-Sports-Day/<any image or video>
//     ICP-Teenage-Youths/<any image or video>
//     ICP-Choir-Outing/<any image or video>
//     (any new folder added here will appear on the page automatically)
//
// The loader is intentionally permissive about filenames:
//   - "IMG-YYYYMMDD-WAxxxx.jpg"  → recognised, sorted by date
//   - "VID-YYYYMMDD-WAxxxx.mp4"  → recognised, sorted by date
//   - "WhatsApp Image 2026-05-10 at 09.15.00.jpeg" → recognised, sorted by date
//   - anything else (e.g. "group-photo.jpg") → still loads, sorts last by filename
//
// Using import.meta.glob with eager: true so Vite includes them in
// the build and we get hashed URLs out of the box.
// ──────────────────────────────────────────────────────────────────

const imageModules = import.meta.glob(
  '../../../assets/images/Gallery-Page-Images/**/*.{jpg,jpeg,JPG,JPEG,png,PNG,webp,WEBP}',
  { eager: true, import: 'default' }
);

const videoModules = import.meta.glob(
  '../../../assets/images/Gallery-Page-Images/**/*.{mp4,MP4,mov,MOV,webm,WEBM}',
  { eager: true, import: 'default' }
);

// Match a file sitting directly inside one of the category subfolders:
//   /…/Gallery-Page-Images/<Category>/<filename>
const CATEGORY_RE = /Gallery-Page-Images\/([^/]+)\/([^/]+)$/;

// Best-effort date extraction from the filename.
// Handles e.g. "IMG-20210503-WA0011.jpg"     → 2021-05-03
//             "VID-20240817-WA0077.mp4"     → 2024-08-17
//             "WhatsApp Image 2026-05-10 …" → 2026-05-10
//             "20210503_120000.jpg"         → 2021-05-03
const DATE_DASHED_RE = /(\d{4})-(\d{2})-(\d{2})/;
const DATE_PACKED_RE = /(\d{4})(\d{2})(\d{2})/;

function extractDate(filename) {
  const dashed = filename.match(DATE_DASHED_RE);
  if (dashed) return { year: dashed[1], month: dashed[2], day: dashed[3] };
  const packed = filename.match(DATE_PACKED_RE);
  if (packed) {
    const y = parseInt(packed[1], 10);
    // Sanity check — anything outside a believable date range is probably
    // a random number in the filename, not a date.
    if (y >= 1990 && y <= 2099) {
      return { year: packed[1], month: packed[2], day: packed[3] };
    }
  }
  return { year: '', month: '', day: '' };
}

function parseEntry(path, src, type) {
  const m = path.match(CATEGORY_RE);
  if (!m) return null;
  const [, category, filename] = m;
  const { year, month, day } = extractDate(filename);
  const yyyymmdd = year ? `${year}${month}${day}` : '';

  // Sort key: chronological when we can, otherwise push to the end and
  // fall back to alphabetical-by-filename so the order is at least stable.
  const sortKey = yyyymmdd
    ? `0-${yyyymmdd}-${filename}`
    : `1-${filename}`;

  return {
    type,
    category,
    filename,
    year,
    month,
    day,
    yyyymmdd,
    sortKey,
    src,
    key: path,
  };
}

const allEntries = [
  ...Object.entries(imageModules).map(([p, s]) => parseEntry(p, s, 'image')),
  ...Object.entries(videoModules).map(([p, s]) => parseEntry(p, s, 'video')),
].filter(Boolean);

// Oldest → newest within each category, undated files at the end.
allEntries.sort((a, b) => a.sortKey.localeCompare(b.sortKey));

const grouped = allEntries.reduce((acc, entry) => {
  (acc[entry.category] ||= []).push(entry);
  return acc;
}, {});

// Order categories by photo count (largest first) so the page leads
// with the most substantive chapter. Ties fall back to alphabetical.
export const CATEGORIES = Object.keys(grouped).sort((a, b) => {
  const diff = grouped[b].length - grouped[a].length;
  return diff !== 0 ? diff : a.localeCompare(b);
});

export const ENTRIES_BY_CATEGORY = grouped;

export const TOTAL_IMAGES = allEntries.filter(e => e.type === 'image').length;
export const TOTAL_VIDEOS = allEntries.filter(e => e.type === 'video').length;

// Map a folder slug to a readable display name when no translation
// override is provided: "ICP-Youth-Ministry" → "ICP Youth Ministry".
export function prettifyCategory(slug) {
  return slug.replace(/-/g, ' ').trim();
}

// Stable URL-friendly id for #anchors, e.g. "category-icp-youth-ministry".
export function categoryAnchorId(slug) {
  return `category-${slug.toLowerCase()}`;
}

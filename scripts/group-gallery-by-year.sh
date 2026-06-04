#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────
# Group every IMG-YYYYMMDD-*.{jpg,jpeg} and VID-YYYYMMDD-*.{mp4,mov}
# file in src/assets/images/Gallery-Page-Images into a subfolder
# named after the year prefix in its filename.
#
# Safe to re-run: only acts on files currently at the root of the
# Gallery-Page-Images folder; files already nested inside a year
# subfolder are left alone.
#
# Usage (from the project root):
#   bash scripts/group-gallery-by-year.sh
# ──────────────────────────────────────────────────────────────────
set -euo pipefail

DIR="$(cd "$(dirname "$0")/.." && pwd)/src/assets/images/Gallery-Page-Images"

if [[ ! -d "$DIR" ]]; then
  echo "✗ Folder not found: $DIR" >&2
  exit 1
fi

cd "$DIR"

moved=0
skipped=0

shopt -s nullglob
for f in IMG-*.jpg IMG-*.jpeg IMG-*.JPG IMG-*.JPEG \
         VID-*.mp4 VID-*.MP4 VID-*.mov VID-*.MOV; do
  # Filename looks like IMG-20210503-WA0011.jpg → year = 2021
  if [[ "$f" =~ ^(IMG|VID)-([0-9]{4})[0-9]{4}- ]]; then
    year="${BASH_REMATCH[2]}"
    mkdir -p "$year"
    if [[ -e "$year/$f" ]]; then
      echo "⊙  $year/$f already exists — skipping"
      skipped=$((skipped + 1))
    else
      mv -- "$f" "$year/"
      moved=$((moved + 1))
    fi
  else
    echo "?  Could not parse year from: $f (left in place)"
  fi
done

echo
echo "✓ Done. Moved $moved file(s); skipped $skipped."
echo "  Layout:"
ls -d */ 2>/dev/null | sed 's/^/    /'

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { useLang } from '../../../context/LanguageContext';
import SmartNavLink from '../../layout/Navbar/SmartNavLink';
import AnimatedYears from '../../shared/AnimatedYears';
import videoStampSrc from '../../../assets/images/Home-Gallery-Images/video-stamp.mp4';
import {
  CATEGORIES,
  ENTRIES_BY_CATEGORY,
  prettifyCategory,
  categoryAnchorId,
} from '../../pages/Gallery/galleryImages';
import './Gallery.scss';

// ──────────────────────────────────────────────────────────────────
// Home-page gallery images
// ──────────────────────────────────────────────────────────────────
// Curated set lives in /assets/images/Home-Gallery-Images.
// The filename is the caption:
//   "Hands-&-Hearts.jpeg"  →  "HANDS & HEARTS"
//   "A-Joyful-Noise.jpg"   →  "A JOYFUL NOISE"
// Drop a new file with the desired filename in that folder and the
// caption updates automatically — no code changes required.
// ──────────────────────────────────────────────────────────────────
const homeGalleryModules = import.meta.glob(
  '../../../assets/images/Home-Gallery-Images/*.{jpg,jpeg,JPG,JPEG,png,PNG}',
  { eager: true, import: 'default' }
);

// "/.../Hands-&-Hearts.jpeg" → "HANDS & HEARTS"
function captionFromPath(path) {
  const filename = path.split('/').pop().replace(/\.[^.]+$/, '');
  return filename.replace(/-/g, ' ').toUpperCase();
}

const HOME_GALLERY_ENTRIES = Object.entries(homeGalleryModules)
  .map(([path, src]) => ({ src, label: captionFromPath(path) }))
  .sort((a, b) => a.label.localeCompare(b.label));

const HOME_GALLERY_SRCS   = HOME_GALLERY_ENTRIES.map(e => e.src);
const HOME_GALLERY_LABELS = HOME_GALLERY_ENTRIES.map(e => e.label);

// ──────────────────────────────────────────────────────────────────
// Auto-playing video tile uses the curated "video-stamp.mp4" sitting
// next to the bento photos in Home-Gallery-Images — keeps the
// home-page video editorially distinct from the dated VID-* files
// used on the /gallery page.
// ──────────────────────────────────────────────────────────────────
const VIDEO_SRC = videoStampSrc;

// ──────────────────────────────────────────────────────────────────
// Category pills (sourced from the gallery page's loader). Cover
// image, slug, and anchor are computed once at module load; the
// label/tagline come from translations and are merged in-component.
// ──────────────────────────────────────────────────────────────────
const CATEGORY_PILLS = CATEGORIES.map(slug => {
  const entries = ENTRIES_BY_CATEGORY[slug] || [];
  const images  = entries.filter(e => e.type === 'image');
  const cover   = images.length
    ? images[Math.floor(images.length / 2)].src
    : null;
  return {
    slug,
    cover,
    fallbackLabel: prettifyCategory(slug),
    count: images.length,
  };
});

// ──────────────────────────────────────────────────────────────────
// Tile config — driven by grid-template-areas in CSS
// ──────────────────────────────────────────────────────────────────
const BENTO_TILES = [
  { id: 'feat', area: 'feat' },  // 2x2 large feature
  { id: 'p1',   area: 'p1'   },
  { id: 'p2',   area: 'p2'   },
  { id: 'p3',   area: 'p3'   },
  { id: 'p4',   area: 'p4'   },
  { id: 'p5',   area: 'p5'   },
];
const BENTO_PHOTO_COUNT = BENTO_TILES.length;

// Lightbox sees every photo: bento first, then marquee (same order
// as HOME_GALLERY_ENTRIES so the index maths line up cleanly).
function buildLightboxItems() {
  return HOME_GALLERY_ENTRIES.map((entry, i) => ({
    id: `gh-${i}`,
    src: entry.src,
    label: entry.label,
    alt: entry.label,
  }));
}

// ──────────────────────────────────────────────────────────────────
// Reveal helper
// ──────────────────────────────────────────────────────────────────
function Reveal({ children, className = '', delay = 0, tag: Tag = 'div' }) {
  const { ref, visible } = useScrollReveal();
  return (
    <Tag
      ref={ref}
      className={`${className}${visible ? ' visible' : ''}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </Tag>
  );
}

// ──────────────────────────────────────────────────────────────────
// Bento photo tile
// ──────────────────────────────────────────────────────────────────
function PhotoTile({ tile, src, label, onOpen, lightboxIdx, delay }) {
  const { ref, visible } = useScrollReveal();
  return (
    <button
      ref={ref}
      type="button"
      className={`gh-tile gh-tile--${tile.area}${visible ? ' visible' : ''}`}
      style={{ transitionDelay: `${delay}s`, gridArea: tile.area }}
      onClick={() => onOpen(lightboxIdx)}
      aria-label={`Open ${label} in lightbox`}
    >
      <img
        src={src}
        alt={label}
        className="gh-tile__img"
        loading="lazy"
        decoding="async"
      />
      <div className="gh-tile__overlay" aria-hidden="true">
        <span className="gh-tile__label">{label}</span>
        <span className="gh-tile__view">View →</span>
      </div>
    </button>
  );
}

// ──────────────────────────────────────────────────────────────────
// Auto-playing video tile (decorative, not in lightbox)
// ──────────────────────────────────────────────────────────────────
function VideoTile({ caption, delay }) {
  const { ref, visible } = useScrollReveal();
  if (!VIDEO_SRC) return null;
  return (
    <SmartNavLink
      href="/gallery"
      className={`gh-tile gh-tile--video${visible ? ' visible' : ''}`}
      style={{ transitionDelay: `${delay}s`, gridArea: 'video' }}
      aria-label={`${caption} — open full gallery`}
    >
      <video
        ref={ref}
        src={VIDEO_SRC}
        className="gh-tile__video"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="gh-tile__overlay gh-tile__overlay--video" aria-hidden="true">
        <span className="gh-tile__live">
          <span className="gh-tile__live-dot" /> Now
        </span>
        <span className="gh-tile__label">{caption}</span>
      </div>
    </SmartNavLink>
  );
}

// ──────────────────────────────────────────────────────────────────
// Stat / CTA tile — links to full /gallery page
// ──────────────────────────────────────────────────────────────────
function StatTile({ label, cta, delay }) {
  const { ref, visible } = useScrollReveal();
  return (
    <SmartNavLink
      href="/gallery"
      className={`gh-tile gh-tile--stat${visible ? ' visible' : ''}`}
      style={{ transitionDelay: `${delay}s`, gridArea: 'stat' }}
    >
      {/* Number is the same dynamic + count-up animation as the
          About section's badge — sourced from <AnimatedYears />. */}
      <AnimatedYears className="gh-tile__stat-num" />
      <span ref={ref} className="gh-tile__stat-lbl">{label}</span>
      <span className="gh-tile__stat-cta">
        <span>{cta}</span>
        <span aria-hidden="true">→</span>
      </span>
    </SmartNavLink>
  );
}

// ──────────────────────────────────────────────────────────────────
// Marquee — slow horizontal scroll of additional photos
// ──────────────────────────────────────────────────────────────────
function Marquee({ photos, labels, baseLightboxIdx, onOpen, ariaLabel }) {
  const { ref, visible } = useScrollReveal();
  if (photos.length === 0) return null;
  // Duplicate photos for a seamless loop
  const looped = [...photos, ...photos];
  return (
    <div ref={ref} className={`gh-marquee${visible ? ' visible' : ''}`} aria-label={ariaLabel}>
      <div className="gh-marquee__track">
        {looped.map((src, i) => {
          const realIdx = i % photos.length;
          const lightboxIdx = baseLightboxIdx + realIdx;
          const label = labels[realIdx] || '';
          return (
            <button
              key={i}
              type="button"
              className="gh-marquee__item"
              onClick={() => onOpen(lightboxIdx)}
              aria-label={`Open ${label} in lightbox`}
              tabIndex={i < photos.length ? 0 : -1}
              aria-hidden={i >= photos.length}
            >
              <img src={src} alt={label} loading="lazy" decoding="async" />
              <span className="gh-marquee__label" aria-hidden="true">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// "Explore the collections" — editorial 4-card strip
// Sits between the bento and the marquee. Each card uses one
// representative photo from that category as a darkened backdrop,
// with the collection name + count overlaid. Clicking deep-links
// to the matching #category- anchor on the /gallery page.
//
// Classnames are still `.gh-year*` so the existing SCSS keeps working
// — only the semantics have changed.
// ──────────────────────────────────────────────────────────────────

// Build a stable cover image per category at module load. We prefer
// the middle photo of the chronological run because edges tend to be
// "first" or "last" shots that don't always represent the collection
// as well as a moment from the middle does.
function pickCoverForCategory(categorySlug) {
  const entries = ENTRIES_BY_CATEGORY[categorySlug] || [];
  const images  = entries.filter(e => e.type === 'image');
  if (images.length === 0) return null;
  return images[Math.floor(images.length / 2)].src;
}

function CategoryPill({ pill }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`gh-year-wrap${visible ? ' visible' : ''}`}
      style={{ transitionDelay: `${pill.idx * 0.07}s` }}
    >
      <SmartNavLink
        href={`/gallery#${categoryAnchorId(pill.slug)}`}
        className="gh-year"
        aria-label={`${pill.label} — ${pill.tagline}`}
      >
        {pill.cover && (
          <img
            src={pill.cover}
            alt=""
            className="gh-year__bg"
            loading="lazy"
            decoding="async"
          />
        )}
        <span className="gh-year__veil" aria-hidden="true" />
        <span className="gh-year__num">{pill.label}</span>
        <span className="gh-year__tag">{pill.tagline}</span>
        <span className="gh-year__arrow" aria-hidden="true">→</span>
      </SmartNavLink>
    </div>
  );
}

function CategoryStrip({ pills, heading }) {
  if (!pills || pills.length === 0) return null;
  return (
    <div className="gh-years" aria-label={heading}>
      <Reveal className="gh-years__head">
        <span className="gh-years__line" aria-hidden="true" />
        <span className="gh-years__title">{heading}</span>
        <span className="gh-years__line" aria-hidden="true" />
      </Reveal>
      <div className="gh-years__grid">
        {pills.map((p, i) => (
          <CategoryPill key={p.slug} pill={{ ...p, idx: i }} />
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// Lightbox (unchanged behavior — Esc, ←, →)
// ──────────────────────────────────────────────────────────────────
function Lightbox({ items, index, onClose, onPrev, onNext, t }) {
  const closeBtnRef = useRef(null);

  useEffect(() => { closeBtnRef.current?.focus(); }, []);

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape')      onClose();
      else if (e.key === 'ArrowLeft')  onPrev();
      else if (e.key === 'ArrowRight') onNext();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, onPrev, onNext]);

  const item = items[index];
  if (!item) return null;

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`Photo: ${item.label}`}
      onClick={onClose}
    >
      <button
        type="button"
        ref={closeBtnRef}
        className="lightbox__close"
        onClick={onClose}
        aria-label={t('galleryHome.lightboxClose')}
      >×</button>

      <button
        type="button"
        className="lightbox__nav lightbox__nav--prev"
        onClick={e => { e.stopPropagation(); onPrev(); }}
        aria-label={t('galleryHome.lightboxPrev')}
      >‹</button>

      <figure className="lightbox__figure" onClick={e => e.stopPropagation()}>
        <img src={item.src} alt={item.alt || item.label} className="lightbox__img" />
        <figcaption className="lightbox__caption">
          {item.label}
          <span className="lightbox__index">{index + 1} / {items.length}</span>
        </figcaption>
      </figure>

      <button
        type="button"
        className="lightbox__nav lightbox__nav--next"
        onClick={e => { e.stopPropagation(); onNext(); }}
        aria-label={t('galleryHome.lightboxNext')}
      >›</button>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// Main component
// ──────────────────────────────────────────────────────────────────
export default function Gallery() {
  const { t } = useLang();
  const [openIdx, setOpenIdx] = useState(null);

  // Lightbox dataset comes straight from the curated entries — its
  // identity is stable, so memoising avoids needless re-renders.
  const lightboxItems = useMemo(() => buildLightboxItems(), []);

  // Bento takes the first N (matching BENTO_TILES.length); the rest
  // flow into the horizontal marquee strip below.
  const bentoSrcs     = HOME_GALLERY_SRCS.slice(0, BENTO_PHOTO_COUNT);
  const bentoLabels   = HOME_GALLERY_LABELS.slice(0, BENTO_PHOTO_COUNT);
  const marqueeSrcs   = HOME_GALLERY_SRCS.slice(BENTO_PHOTO_COUNT);
  const marqueeLabels = HOME_GALLERY_LABELS.slice(BENTO_PHOTO_COUNT);

  const handleOpen = useCallback(i => setOpenIdx(i), []);
  const handleClose = useCallback(() => setOpenIdx(null), []);
  const handlePrev = useCallback(
    () => setOpenIdx(i => (i === 0 ? lightboxItems.length - 1 : i - 1)),
    [lightboxItems.length]
  );
  const handleNext = useCallback(
    () => setOpenIdx(i => (i === lightboxItems.length - 1 ? 0 : i + 1)),
    [lightboxItems.length]
  );

  return (
    <section id="gallery" className="gallery" aria-labelledby="gallery-title">
      <div className="gallery__head">
        <div>
          <Reveal className="gallery__eyebrow">{t('galleryHome.eyebrow')}</Reveal>
          <Reveal className="gallery__title" delay={0.1}>
            <h2 id="gallery-title">{t('galleryHome.titleLine1')} <em>{t('galleryHome.titleAccent')}</em></h2>
          </Reveal>
          <Reveal className="gallery__sub" delay={0.18}>
            {t('galleryHome.sub')}
          </Reveal>
        </div>
        <Reveal className="gallery__cta-wrap" delay={0.2}>
          <SmartNavLink href="/gallery" className="gallery__cta">
            {t('galleryHome.cta')}
          </SmartNavLink>
        </Reveal>
      </div>

      {/* ── Bento grid ── */}
      <div className="gh-bento" role="list">
        {BENTO_TILES.map((tile, i) => {
          const src = bentoSrcs[i];
          if (!src) return null;
          const label = bentoLabels[i] || '';
          return (
            <PhotoTile
              key={tile.id}
              tile={tile}
              src={src}
              label={label}
              lightboxIdx={i}
              onOpen={handleOpen}
              delay={i * 0.05}
            />
          );
        })}

        <VideoTile caption={t('galleryHome.videoCaption')} delay={0.4} />

        <StatTile
          label={t('galleryHome.statLabel')}
          cta={t('galleryHome.statCta')}
          delay={0.45}
        />
      </div>

      {/* ── Explore the collections (deep-links into /gallery) ── */}
      <CategoryStrip
        pills={CATEGORY_PILLS.map(p => {
          // Pull translation overrides for each category if present;
          // fall back to the prettified slug + a generic tagline.
          const meta = (t('galleryPage.categories') || {})[p.slug] || {};
          const photosLabel = t('galleryPage.photosLabel') || 'photos';
          return {
            ...p,
            label:   meta.title || p.fallbackLabel,
            tagline: meta.shortLabel || `${p.count} ${photosLabel}`,
          };
        })}
        heading={t('galleryHome.collectionsHeading') || t('galleryHome.yearsHeading')}
      />

      {/* ── Marquee strip ── */}
      <Marquee
        photos={marqueeSrcs}
        labels={marqueeLabels}
        baseLightboxIdx={BENTO_PHOTO_COUNT}
        onOpen={handleOpen}
        ariaLabel={t('galleryHome.marqueeAria')}
      />

      {openIdx !== null && (
        <Lightbox
          items={lightboxItems}
          index={openIdx}
          onClose={handleClose}
          onPrev={handlePrev}
          onNext={handleNext}
          t={t}
        />
      )}
    </section>
  );
}

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { useLang } from '../../../context/LanguageContext';
import { usePageTheme } from '../../../hooks/usePageTheme';
import SmartNavLink from '../../layout/Navbar/SmartNavLink';
import MemoryLane from '../../sections/MemoryLane/MemoryLane';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faXmark,
  faUpRightAndDownLeftFromCenter,
  faImages,
} from '@fortawesome/free-solid-svg-icons';
import EmptyState from '../../shared/EmptyState/EmptyState';
import {
  CATEGORIES,
  ENTRIES_BY_CATEGORY,
  TOTAL_IMAGES,
  prettifyCategory,
  categoryAnchorId,
} from './galleryImages';
import './GalleryPage.scss';

// ─────────────────────────────────────────────────────────────────────
// Small reveal-on-scroll wrapper used throughout the page
// ─────────────────────────────────────────────────────────────────────
function Reveal({ children, className = '', delay = 0, tag: Tag = 'div', id }) {
  const { ref, visible } = useScrollReveal();
  return (
    <Tag
      ref={ref}
      id={id}
      className={`${className}${visible ? ' visible' : ''}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </Tag>
  );
}

// ─────────────────────────────────────────────────────────────────────
// A "scene" within a category — these break the rhythm of the mosaic
// with feature images that span a wide width
// ─────────────────────────────────────────────────────────────────────
function FeatureScene({ entry, caption, onOpen, idx }) {
  const { ref, visible } = useScrollReveal();
  if (!entry) return null;

  if (entry.type === 'video') {
    return (
      <figure
        ref={ref}
        className={`gp-feature gp-feature--video${visible ? ' visible' : ''}`}
      >
        <video
          src={entry.src}
          muted
          loop
          playsInline
          autoPlay
          className="gp-feature__media"
        />
        {caption && <figcaption className="gp-feature__caption">{caption}</figcaption>}
      </figure>
    );
  }

  return (
    <button
      ref={ref}
      type="button"
      className={`gp-feature${visible ? ' visible' : ''}`}
      onClick={() => onOpen(idx)}
      aria-label="Open photo in lightbox"
    >
      <img src={entry.src} alt="" className="gp-feature__media" loading="lazy" decoding="async" />
      {caption && <span className="gp-feature__caption">{caption}</span>}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Mosaic tile with deterministic varied row/col spans for visual interest
// ─────────────────────────────────────────────────────────────────────
const SPAN_PATTERN = [
  { col: 2, row: 2 }, { col: 1, row: 1 }, { col: 1, row: 1 },
  { col: 1, row: 1 }, { col: 1, row: 2 }, { col: 1, row: 1 },
  { col: 2, row: 1 }, { col: 1, row: 1 }, { col: 1, row: 1 },
  { col: 1, row: 2 }, { col: 1, row: 1 }, { col: 1, row: 1 },
  { col: 1, row: 1 }, { col: 2, row: 2 }, { col: 1, row: 1 },
  { col: 1, row: 1 }, { col: 1, row: 1 }, { col: 1, row: 1 },
];

function MosaicTile({ entry, idx, onOpen, mosaicIdx }) {
  const { ref, visible } = useScrollReveal();
  const span = SPAN_PATTERN[mosaicIdx % SPAN_PATTERN.length];

  return (
    <button
      ref={ref}
      type="button"
      className={`gp-tile${visible ? ' visible' : ''}`}
      style={{
        gridColumn: `span ${span.col}`,
        gridRow: `span ${span.row}`,
        transitionDelay: `${(mosaicIdx % 6) * 0.05}s`,
      }}
      onClick={() => onOpen(idx)}
      aria-label="Open photo in lightbox"
    >
      <img
        src={entry.src}
        alt=""
        className="gp-tile__img"
        loading="lazy"
        decoding="async"
      />
      <span className="gp-tile__overlay" aria-hidden="true">
        <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} />
      </span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Polaroid-style photo card with a slight tilt
// ─────────────────────────────────────────────────────────────────────
function Polaroid({ entry, idx, onOpen, tilt = 0, caption }) {
  const { ref, visible } = useScrollReveal();
  if (!entry) return null;
  return (
    <button
      ref={ref}
      type="button"
      className={`gp-polaroid${visible ? ' visible' : ''}`}
      style={{ '--tilt': `${tilt}deg` }}
      onClick={() => onOpen(idx)}
      aria-label="Open photo in lightbox"
    >
      <img src={entry.src} alt="" loading="lazy" decoding="async" />
      {caption && <span className="gp-polaroid__caption">{caption}</span>}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────
// LazyChapter — defers rendering a chapter's heavy DOM (hero image,
// polaroids, dozens of mosaic tiles, scroll-reveal observers per tile)
// until the chapter scrolls within ~1.5 viewports. Reserves a min-height
// placeholder so the scrollbar doesn't jump when chapters mount.
//
// Why this matters: at ~200 photos today across 6 categories, the page
// has hundreds of <img> nodes and IntersectionObservers active from
// first paint. As the archive grows, mounting them all up front becomes
// the bottleneck — not the image fetches themselves (those are already
// lazy via loading="lazy"). Skeletons mount instantly; full content
// activates as the visitor approaches.
// ─────────────────────────────────────────────────────────────────────
function LazyChapter({ children, estimatedHeight = '85vh' }) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (active) return undefined;
    const node = ref.current;
    if (!node) return undefined;

    // Browsers without IntersectionObserver (very old) just mount eagerly.
    if (typeof IntersectionObserver === 'undefined') {
      setActive(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(true);
            observer.disconnect();
            return;
          }
        }
      },
      { rootMargin: '1500px 0px' } // mount well before in view
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [active]);

  return (
    <div
      ref={ref}
      // Once the chapter has hydrated we hand the height back to its
      // own content so layout can't get stuck at a stale min-height.
      style={active ? undefined : { minHeight: estimatedHeight }}
    >
      {active ? children : null}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// A whole "chapter" — one category's worth of photos
// ─────────────────────────────────────────────────────────────────────
function CategoryChapter({
  category,
  entries,
  meta,
  index,
  getGlobalIdx,
  onOpen,
  countLabel,
}) {
  // Pick a few images for special placements
  const heroEntry = entries.find(e => e.type === 'image') || entries[0];
  const videoEntry = entries.find(e => e.type === 'video');
  const imageEntries = entries.filter(e => e.type === 'image');

  // Polaroid pair: pick the 2nd and 3rd images
  const pol1 = imageEntries[1];
  const pol2 = imageEntries[2];

  // Mid-chapter feature: pick a middle image
  const featureEntry = imageEntries[Math.floor(imageEntries.length / 2)];

  // Mosaic gets the remainder
  const usedKeys = new Set([
    heroEntry?.key, videoEntry?.key, pol1?.key, pol2?.key, featureEntry?.key,
  ]);
  const mosaicEntries = imageEntries.filter(e => !usedKeys.has(e.key));

  const displayTitle = meta?.title || prettifyCategory(category);
  const eyebrow = meta?.eyebrow || `Chapter ${String(index + 1).padStart(2, '0')}`;
  const anchorId = categoryAnchorId(category);

  return (
    <section
      className={`gp-chapter gp-chapter--${category.toLowerCase()}`}
      aria-labelledby={anchorId}
    >
      {/* ── Category header band ── */}
      <Reveal className="gp-chapter__header" delay={0}>
        <span className="gp-chapter__line" aria-hidden="true" />
        <div className="gp-chapter__head-text">
          <span className="gp-chapter__eyebrow">{eyebrow}</span>
          <h2 className="gp-chapter__title" id={anchorId}>{displayTitle}</h2>
          <span className="gp-chapter__count">
            {imageEntries.length} {countLabel}
          </span>
        </div>
        <span className="gp-chapter__line" aria-hidden="true" />
      </Reveal>

      {meta?.caption && (
        <Reveal className="gp-chapter__caption" delay={0.1}>
          <p>{meta.caption}</p>
        </Reveal>
      )}

      {/* ── Hero strip ── */}
      {heroEntry && (
        <FeatureScene
          entry={heroEntry}
          idx={getGlobalIdx(heroEntry)}
          onOpen={onOpen}
          caption={displayTitle}
        />
      )}

      {/* ── Polaroid pair ── */}
      {(pol1 || pol2) && (
        <div className="gp-polaroids">
          {pol1 && <Polaroid entry={pol1} idx={getGlobalIdx(pol1)} onOpen={onOpen} tilt={-3} caption={displayTitle} />}
          {pol2 && <Polaroid entry={pol2} idx={getGlobalIdx(pol2)} onOpen={onOpen} tilt={4} caption={meta?.shortLabel || ''} />}
        </div>
      )}

      {/* ── Mosaic section A (first half) ── */}
      <div className="gp-mosaic">
        {mosaicEntries.slice(0, 9).map((entry, i) => (
          <MosaicTile
            key={entry.key}
            entry={entry}
            idx={getGlobalIdx(entry)}
            mosaicIdx={i}
            onOpen={onOpen}
          />
        ))}
      </div>

      {/* ── Optional video moment between mosaics ── */}
      {videoEntry && (
        <FeatureScene
          entry={videoEntry}
          idx={getGlobalIdx(videoEntry)}
          onOpen={onOpen}
        />
      )}

      {/* ── Feature image ── */}
      {featureEntry && featureEntry !== heroEntry && (
        <FeatureScene
          entry={featureEntry}
          idx={getGlobalIdx(featureEntry)}
          onOpen={onOpen}
        />
      )}

      {/* ── Mosaic section B (rest) ── */}
      {mosaicEntries.length > 9 && (
        <div className="gp-mosaic gp-mosaic--alt">
          {mosaicEntries.slice(9).map((entry, i) => (
            <MosaicTile
              key={entry.key}
              entry={entry}
              idx={getGlobalIdx(entry)}
              mosaicIdx={i + 11}  // shift pattern offset for variety
              onOpen={onOpen}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────
// "Jump to" pill nav — small TOC of category chapters
// ─────────────────────────────────────────────────────────────────────
function CategoryNav({ categories, categoryMeta, label }) {
  if (!categories || categories.length === 0) return null;
  return (
    <nav className="gp-catnav" aria-label={label}>
      <div className="gp-catnav__inner">
        {categories.map((slug, i) => {
          const name = categoryMeta?.[slug]?.title || prettifyCategory(slug);
          return (
            <a
              key={slug}
              href={`#${categoryAnchorId(slug)}`}
              className="gp-catnav__pill"
              style={{ transitionDelay: `${i * 0.04}s` }}
            >
              <span className="gp-catnav__num">{String(i + 1).padStart(2, '0')}</span>
              <span className="gp-catnav__name">{name}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Lightbox shared across all categories (image entries only)
// ─────────────────────────────────────────────────────────────────────
function Lightbox({ items, index, onClose, onPrev, onNext, t, categoryMeta }) {
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

  const catName =
    categoryMeta?.[item.category]?.title || prettifyCategory(item.category);

  return (
    <div className="gp-lightbox" role="dialog" aria-modal="true" onClick={onClose}>
      <button
        ref={closeBtnRef}
        type="button"
        className="gp-lightbox__close"
        onClick={onClose}
        aria-label={t('galleryHome.lightboxClose')}
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>

      <button
        type="button"
        className="gp-lightbox__nav gp-lightbox__nav--prev"
        onClick={e => { e.stopPropagation(); onPrev(); }}
        aria-label={t('galleryHome.lightboxPrev')}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>

      <figure className="gp-lightbox__figure" onClick={e => e.stopPropagation()}>
        {item.type === 'video' ? (
          <video src={item.src} controls autoPlay className="gp-lightbox__media" />
        ) : (
          <img src={item.src} alt="" className="gp-lightbox__media" />
        )}
        <figcaption className="gp-lightbox__caption">
          {catName}
          <span className="gp-lightbox__index">{index + 1} / {items.length}</span>
        </figcaption>
      </figure>

      <button
        type="button"
        className="gp-lightbox__nav gp-lightbox__nav--next"
        onClick={e => { e.stopPropagation(); onNext(); }}
        aria-label={t('galleryHome.lightboxNext')}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
}

// * ─────────────────────────────────────────────────────────────────────
// * Main page
// * ─────────────────────────────────────────────────────────────────────
export default function GalleryPage() {
  const { t } = useLang();
  const [openIdx, setOpenIdx] = useState(null);

  // Flat list of all entries (used by the lightbox; videos are included)
  const allEntries = useMemo(() => {
    return CATEGORIES.flatMap(c => ENTRIES_BY_CATEGORY[c]);
  }, []);

  // Map each entry's key to its global index (for lightbox navigation)
  const indexByKey = useMemo(() => {
    const map = new Map();
    allEntries.forEach((e, i) => map.set(e.key, i));
    return map;
  }, [allEntries]);

  const getGlobalIdx = useCallback(entry => indexByKey.get(entry.key) ?? 0, [indexByKey]);

  const handleOpen = useCallback(i => setOpenIdx(i), []);
  const handleClose = useCallback(() => setOpenIdx(null), []);
  const handlePrev = useCallback(
    () => setOpenIdx(i => (i === 0 ? allEntries.length - 1 : i - 1)),
    [allEntries.length]
  );
  const handleNext = useCallback(
    () => setOpenIdx(i => (i === allEntries.length - 1 ? 0 : i + 1)),
    [allEntries.length]
  );

  // Smooth-scroll when category-nav links are clicked
  useEffect(() => {
    function onClick(e) {
      const a = e.target.closest('a.gp-catnav__pill');
      if (!a) return;
      const id = a.getAttribute('href')?.slice(1);
      const el = id && document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', `#${id}`);
      }
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // Update document title
  useEffect(() => {
    const original = document.title;
    document.title = `${t('galleryPage.metaTitle')} — ICP`;
    return () => { document.title = original; };
  }, [t]);

  const categoryMeta = t('galleryPage.categories') || {};
  const photosLabel = t('galleryPage.photosLabel') || 'photos';

  usePageTheme('gallery');

  return (
    <main id="main" tabIndex="-1" className="gallery-page">
      {/* ── Memory Lane (sepia opening slideshow — uses Old-Images) ── */}
      <MemoryLane />

      {/* ── Present-day hero ── */}
      <header className="gp-hero" aria-labelledby="gp-title">
        {/* Backdrop image layer — separated so we can animate it with
            a slow Ken Burns drift without touching the rest of the
            hero composition. */}
        <div className="gp-hero__bg" aria-hidden="true" />
        <div className="gp-hero__veil" aria-hidden="true" />
        <div className="gp-hero__spot" aria-hidden="true" />
        <div className="gp-hero__inner">
          <Reveal className="gp-hero__eyebrow">{t('galleryPage.eyebrow')}</Reveal>
          <Reveal tag="h1" className="gp-hero__title" delay={0.1} id="gp-title">
            <span className="gp-hero__title-line">{t('galleryPage.titleLine1')}</span>
            <em className="gp-hero__title-accent">{t('galleryPage.titleAccent')}</em>
          </Reveal>
          <Reveal className="gp-hero__sub" delay={0.2}>
            {t('galleryPage.sub')}
          </Reveal>

          <Reveal className="gp-hero__stats" delay={0.3}>
            <div className="gp-hero__stat">
              <span className="gp-hero__stat-num">{TOTAL_IMAGES}+</span>
              <span className="gp-hero__stat-label">{t('galleryPage.statPhotos') || 'Photos'}</span>
            </div>
            <div className="gp-hero__stat">
              <span className="gp-hero__stat-num">{CATEGORIES.length}</span>
              <span className="gp-hero__stat-label">{t('galleryPage.statCollections') || 'Collections'}</span>
            </div>
            <div className="gp-hero__stat">
              <span className="gp-hero__stat-num">∞</span>
              <span className="gp-hero__stat-label">{t('galleryPage.statMemories') || 'Memories'}</span>
            </div>
          </Reveal>
        </div>

        <div className="gp-hero__scroll" aria-hidden="true">
          <span className="gp-hero__scroll-line" />
          <span>Scroll</span>
        </div>
      </header>

      {/* ── Intro paragraph ── */}
      <section className="gp-intro" aria-label="Introduction">
        <Reveal className="gp-intro__inner">
          <span className="gp-intro__quote" aria-hidden="true">“</span>
          <p>{t('galleryPage.intro')}</p>
        </Reveal>
      </section>

      {/* ── Category jump-nav ── */}
      <CategoryNav
        categories={CATEGORIES}
        categoryMeta={categoryMeta}
        label={t('galleryPage.navLabel') || 'Jump to collection'}
      />

      {/* ── Category chapters ──
          The first chapter renders eagerly (it's visible right after
          the intro and the user has already paid the scroll cost to
          get here). Subsequent chapters mount via LazyChapter so the
          page isn't holding hundreds of <img> + observers from the
          first paint. */}
      {CATEGORIES.length > 0 ? (
        CATEGORIES.map((category, i) => {
          const chapter = (
            <CategoryChapter
              key={category}
              category={category}
              entries={ENTRIES_BY_CATEGORY[category]}
              meta={categoryMeta[category]}
              index={i}
              getGlobalIdx={getGlobalIdx}
              onOpen={handleOpen}
              countLabel={photosLabel}
            />
          );
          return i === 0
            ? chapter
            : <LazyChapter key={category}>{chapter}</LazyChapter>;
        })
      ) : (
        <section className="gp-empty-wrap" aria-label="No photos yet">
          <EmptyState
            icon={faImages}
            title={t('galleryPage.emptyTitle') || 'No photos in the archive yet'}
            description={
              t('galleryPage.emptyDesc') ||
              'We’re still curating this space. Come back soon — there are stories on the way.'
            }
            action={{
              label: t('galleryPage.closingCta') || 'Plan your visit',
              href: '/#map',
            }}
          />
        </section>
      )}

      {/* ── Closing band ── */}
      <section className="gp-closing" aria-labelledby="gp-closing-title">
        <div className="gp-closing__inner">
          <Reveal tag="h2" className="gp-closing__title" id="gp-closing-title">
            <em>{t('galleryPage.closingTitle')}</em>
          </Reveal>
          <Reveal className="gp-closing__body" delay={0.1}>
            <p>{t('galleryPage.closingBody')}</p>
          </Reveal>
          <Reveal className="gp-closing__cta" delay={0.2}>
            <SmartNavLink href="/#map" className="gp-closing__btn">
              <span>{t('galleryPage.closingCta')}</span>
              <span aria-hidden="true">→</span>
            </SmartNavLink>
          </Reveal>
        </div>
      </section>

      {/* ── Lightbox ── */}
      {openIdx !== null && (
        <Lightbox
          items={allEntries}
          index={openIdx}
          onClose={handleClose}
          onPrev={handlePrev}
          onNext={handleNext}
          t={t}
          categoryMeta={categoryMeta}
        />
      )}
    </main>
  );
}

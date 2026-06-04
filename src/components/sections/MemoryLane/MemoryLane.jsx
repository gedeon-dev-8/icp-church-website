import { useState, useEffect, useCallback, useRef } from 'react';
import { useLang } from '../../../context/LanguageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import './MemoryLane.scss';

// ── Load every old image. Vite glob picks up new files automatically.
// The pattern matches both nested folders and filenames with spaces /
// parentheses (e.g. "WhatsApp Image 2026-05-05 at 18.24.16 (1).jpeg").
const oldImageModules = import.meta.glob(
  '../../../assets/images/Old-Images/*.{jpeg,jpg,JPG,JPEG,png,PNG}',
  { eager: true, import: 'default' }
);

// Sort by filename so the order is deterministic and stable across builds.
const OLD_IMAGES = Object.entries(oldImageModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, src]) => src);

const SLIDE_INTERVAL = 6500;

export default function MemoryLane() {
  const { t } = useLang();
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef(null);

  const total = OLD_IMAGES.length;

  // ── Auto-advance ──
  useEffect(() => {
    if (paused || total < 2) return undefined;
    const id = setInterval(() => {
      setActiveIdx(i => (i + 1) % total);
    }, SLIDE_INTERVAL);
    return () => clearInterval(id);
  }, [paused, total]);

  // ── Keyboard nav when section is in view ──
  useEffect(() => {
    const onKey = (e) => {
      const sec = sectionRef.current;
      if (!sec) return;
      const rect = sec.getBoundingClientRect();
      const inView = rect.bottom > 0 && rect.top < window.innerHeight * 0.6;
      if (!inView) return;
      if (e.key === 'ArrowLeft')  goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goPrev = useCallback(() => {
    setActiveIdx(i => (i === 0 ? total - 1 : i - 1));
  }, [total]);

  const goNext = useCallback(() => {
    setActiveIdx(i => (i + 1) % total);
  }, [total]);

  // Bail out if there are no old images yet — prevents an empty hero
  if (total === 0) return null;

  // Progress through the slideshow (0 → 1), used to fill the progress bar
  const progress = total > 0 ? (activeIdx + 1) / total : 0;

  return (
    <section
      ref={sectionRef}
      id="memory-lane"
      className="memory"
      aria-labelledby="memory-title"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Slide stack ── */}
      <div className="memory__stack" aria-hidden="true">
        {OLD_IMAGES.map((src, i) => {
          // Alternating pan direction for visual variety
          const direction = i % 2 === 0 ? 'right' : 'left';
          return (
            <div
              key={i}
              className={[
                'memory__slide',
                i === activeIdx ? 'is-active' : '',
                `memory__slide--${direction}`,
              ].filter(Boolean).join(' ')}
              style={{ backgroundImage: `url(${src})` }}
            />
          );
        })}
      </div>

      {/* ── Vintage treatments ── */}
      <div className="memory__veil" aria-hidden="true" />
      <div className="memory__grain" aria-hidden="true" />
      <div className="memory__vignette" aria-hidden="true" />
      <div className="memory__scratches" aria-hidden="true">
        <span /><span /><span />
      </div>

      {/* ── Center content ── */}
      <div className="memory__content">
        <p className="memory__eyebrow">
          <span className="memory__eyebrow-line" aria-hidden="true" />
          {t('memoryLane.eyebrow')}
          <span className="memory__eyebrow-line" aria-hidden="true" />
        </p>
        <h1 id="memory-title" className="memory__title">
          {t('memoryLane.titleLine1')}{' '}
          <em>{t('memoryLane.titleAccent')}</em>
        </h1>
        <p className="memory__body">{t('memoryLane.body')}</p>
      </div>

      {/* ── Slide controls ── */}
      <div className="memory__controls" role="group" aria-label="Slideshow navigation">
        <button
          type="button"
          className="memory__arrow memory__arrow--prev"
          onClick={goPrev}
          aria-label={t('memoryLane.prevAria')}
        >
          <FontAwesomeIcon icon={faChevronLeft} aria-hidden="true" />
        </button>

        {/* With 50+ memories in the cycle, a per-slide dot row becomes
            unreadable. A thin progress bar gives the same sense of
            "where am I in the journey" without the clutter. The
            counter below provides the exact number. */}
        <div
          className="memory__progress"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={activeIdx + 1}
          aria-label={t('memoryLane.slideAria')}
        >
          <span className="memory__progress-track" aria-hidden="true">
            <span
              className="memory__progress-fill"
              style={{ width: `${progress * 100}%` }}
            />
          </span>
        </div>

        <button
          type="button"
          className="memory__arrow memory__arrow--next"
          onClick={goNext}
          aria-label={t('memoryLane.nextAria')}
        >
          <FontAwesomeIcon icon={faChevronRight} aria-hidden="true" />
        </button>
      </div>

      {/* ── Slide counter ── */}
      <div className="memory__counter" aria-live="polite">
        <span className="memory__counter-num">{String(activeIdx + 1).padStart(2, '0')}</span>
        <span className="memory__counter-sep" aria-hidden="true">/</span>
        <span className="memory__counter-total">{String(total).padStart(2, '0')}</span>
      </div>

      {/* ── Scroll into the present ── */}
      <a href="#gp-title" className="memory__scroll">
        <span className="memory__scroll-text">{t('memoryLane.scrollHint')}</span>
        <span className="memory__scroll-arrow" aria-hidden="true">
          <FontAwesomeIcon icon={faArrowDown} />
        </span>
      </a>
    </section>
  );
}

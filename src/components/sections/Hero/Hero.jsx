import { useEffect, useState } from 'react';
import { useLang } from '../../../context/LanguageContext';
import { useMouseParallax } from '../../../hooks/useMouseParallax';
import { useCountdown, useNextSundayService } from '../../../hooks/useCountdown';

import './Hero.scss';

// ────────────────────────────────────────────────────────────────────
// Curated hero imagery — keep this tight (4 images max) so the
// rotation feels editorial rather than a slideshow. Each entry below
// names the file inside /assets/images/Hero-Images/ so swapping a
// shot is a one-line change.
// ────────────────────────────────────────────────────────────────────
const CURATED_FILENAMES = ['1.png', '15.png', '17.png', '14.png'];

// Vite returns a map of every file in the directory; we pick the four
// we care about so the bundle only ships those (and the other source
// files in /Hero-Images stay available for future curation tweaks).
const HERO_MODULES = import.meta.glob(
  '../../../assets/images/Hero-Images/*.{png,PNG,jpg,JPG,jpeg,JPEG,webp,WEBP,gif,GIF,}',
  { eager: true, import: 'default' }
);

function pickByName(name) {
  const found = Object.entries(HERO_MODULES).find(([path]) =>
    path.endsWith(`/${name}`)
  );
  return found ? found[1] : null;
}

const CAROUSEL_IMAGES = CURATED_FILENAMES.map(pickByName).filter(Boolean);
const CAROUSEL_INTERVAL = 9000; // slower cross-fade — let each frame linger

// ─── Small helper: split text into a stagger-animated word stream ───
function AnimatedWords({ text, baseDelay = 0, className = '' }) {
  const words = text.split(' ');
  return (
    <>
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          className={`hero__word ${className}`.trim()}
          style={{ animationDelay: `${baseDelay + i * 0.09}s` }}
        >
          {w}
          {/* Use NBSP-equivalent to keep word spacing without trailing space */}
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </>
  );
}

export default function Hero() {
  const { t, lang } = useLang();
  const heroRef = useMouseParallax();

  // ── Background carousel ──
  const [activeBg, setActiveBg] = useState(0);
  useEffect(() => {
    if (CAROUSEL_IMAGES.length < 2) return undefined;
    const id = setInterval(() => {
      setActiveBg(i => (i + 1) % CAROUSEL_IMAGES.length);
    }, CAROUSEL_INTERVAL);
    return () => clearInterval(id);
  }, []);

  // ── Scroll-driven parallax on the background ──
  // We move the background a fraction of the scroll distance so the
  // foreground content feels like it's gliding past the imagery, not
  // sitting on top of it. CSS uses --scroll-y to translate the stack.
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  // Clamp to a reasonable range — we only want parallax while the hero
  // is in view (roughly the first viewport-height of scroll).
  const parallaxY = Math.min(scrollY * 0.25, 200);

  // ── Live countdown to next Sunday Service (Africa/Johannesburg) ──
  // useNextSundayService advances automatically once a service has
  // passed, so a tab left open over the weekend rolls to next Sunday.
  const target = useNextSundayService();
  const { days, hours, minutes, isLive, isStartingSoon } = useCountdown(target);

  const next = t('hero.next');

  // Re-trigger word animation when language changes (key change forces remount)
  const titleKey = `title-${lang}`;

  return (
    <section
      id="hero"
      className="hero"
      ref={heroRef}
      aria-labelledby="hero-title"
    >
      {/* ── Background carousel (scroll parallax via --scroll-y) ── */}
      <div
        className="hero__bg-stack"
        aria-hidden="true"
        style={{ '--scroll-y': `${parallaxY}px` }}
      >
        {CAROUSEL_IMAGES.map((src, i) => (
          <div
            key={i}
            className={`hero__bg-slide${i === activeBg ? ' is-active' : ''}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>

      {/* ── Veil + cursor glow ── */}
      <div className="hero__veil" aria-hidden="true" />
      <div className="hero__cursor-glow" aria-hidden="true" />

      {/* ── Decoration layers (mouse parallax via wrappers so we can layer transforms) ── */}
      <div className="hero__layer hero__layer--depth-3" aria-hidden="true">
        <div className="hero__orb" />
      </div>
      <div className="hero__layer hero__layer--depth-2" aria-hidden="true">
        <div className="hero__cross" />
      </div>

      <div className="hero__lines hero__layer hero__layer--depth-1" aria-hidden="true">
        <svg viewBox="0 0 1440 900" fill="none" preserveAspectRatio="xMidYMid slice">
          <path d="M0 450 Q360 200 720 450 Q1080 700 1440 450" stroke="#1ad8d8" strokeWidth="1" />
          <path d="M0 300 Q480 600 960 300 Q1200 150 1440 300" stroke="#1ad8d8" strokeWidth="0.5" />
          <line x1="720" y1="0" x2="720" y2="900" stroke="#1ad8d8" strokeWidth="0.5" />
          <circle cx="720" cy="200" r="120" stroke="#1ad8d8" strokeWidth="0.5" fill="none" />
          <circle cx="720" cy="200" r="60" stroke="#1ad8d8" strokeWidth="0.3" fill="none" />
        </svg>
      </div>

      {/* ── Floating particles ── */}
      <div className="hero__particles" aria-hidden="true">
        <span /><span /><span /><span /><span /><span /><span /><span />
      </div>

      {/* ── Content ── */}
      <div className="hero__content">
        <p className="hero__eyebrow">
          <span className="hero__eyebrow-line" aria-hidden="true" />
          {t('hero.eyebrow')}
        </p>

        <h1 id="hero-title" className="hero__title" key={titleKey}>
          <span className="hero__title-line">
            <AnimatedWords text={t('hero.titleLine1')} baseDelay={0.20} />
          </span>
          <span className="hero__title-line">
            <AnimatedWords text={t('hero.titleLine2')} baseDelay={0.45} />
            {' '}
            <span className="accent">
              <AnimatedWords text={t('hero.titleAccent')} baseDelay={0.62} />
            </span>
          </span>
        </h1>

        <hr/>

        <h1 id="hero-title" className="hero__title__sub" key={titleKey}>
          <span className="hero__title-line">
            <AnimatedWords text={t('hero.titleLine22')} baseDelay={0.45} />
            <span className="hero__title-line">
            <AnimatedWords text={t('hero.titleLine11')} baseDelay={0.20} />
          </span>
            <span className="accent">
              <AnimatedWords text={t('hero.titleAccent1')} baseDelay={0.62} />
            </span>
          </span>
        </h1>

        <p className="hero__sub">{t('hero.sub')}</p>

        <div className="hero__cta">
          <a href="#announcement" className="hero__btn-primary">
            <span>{t('hero.ctaPrimary')}</span>
            <span aria-hidden="true">→</span>
          </a>
          <a href="#about" className="hero__btn-ghost">{t('hero.ctaSecondary')}</a>
        </div>
      </div>

      {/* ── Live next-service card ── */}
      <aside
        className={`hero__next${isLive ? ' is-live' : ''}${isStartingSoon ? ' is-soon' : ''}`}
        aria-label={`${next?.kicker || 'Next'}: ${next?.service || ''}`}
      >
        <div className="hero__next-kicker">
          <span className="hero__next-dot" aria-hidden="true" />
          {isLive ? next?.live : next?.kicker}
        </div>
        <div className="hero__next-name">{next?.service}</div>
        <div className="hero__next-time">{next?.time}</div>

        <div className="hero__next-countdown" aria-live="polite">
          {isLive ? (
            <span className="hero__next-tag">{next?.live}</span>
          ) : isStartingSoon ? (
            <span className="hero__next-tag">{next?.starting}</span>
          ) : (
            <>
              <span className="hero__next-unit">
                <span className="hero__next-num">{days}</span>
                <span className="hero__next-lbl">{next?.day}</span>
              </span>
              <span className="hero__next-sep" aria-hidden="true">{next?.separator}</span>
              <span className="hero__next-unit">
                <span className="hero__next-num">{String(hours).padStart(2, '0')}</span>
                <span className="hero__next-lbl">{next?.hour}</span>
              </span>
              <span className="hero__next-sep" aria-hidden="true">{next?.separator}</span>
              <span className="hero__next-unit">
                <span className="hero__next-num">{String(minutes).padStart(2, '0')}</span>
                <span className="hero__next-lbl">{next?.minute}</span>
              </span>
            </>
          )}
        </div>

        <a href="#map" className="hero__next-cta">
          <span>{next?.cta}</span>
          <span aria-hidden="true">→</span>
        </a>
      </aside>

      {/* ── Scroll cue ── */}
      <a href="#about" className="hero__scroll" aria-label={t('hero.scroll')}>
        <span className="hero__scroll-line" aria-hidden="true" />
        <span className="hero__scroll-text">{t('hero.scroll')}</span>
      </a>
    </section>
  );
}

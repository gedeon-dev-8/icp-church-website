import { useEffect, useRef, useState } from 'react';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { useLang } from '../../../context/LanguageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot,
  faWifi,
  faRotateRight,
} from '@fortawesome/free-solid-svg-icons';
import './Map.scss';

// ─── 294 Flowers Street, Capital Park, Pretoria, 0084 ──────────
// Coordinates lifted directly from the embed URL below.
const LAT = -25.727125344715965;
const LNG = 28.190821076323992;

// Google Maps embed pinpointing the church (top-down map view).
// Replace the `pb=` payload if the framing/zoom ever needs to change.
const MAP_SRC =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3594.314072263085!2d28.190821076323992!3d-25.727125344715965!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1ebfd8a5ed431729%3A0xe48c9eb516e1f1db!2s294%20Flowers%20St%2C%20Capital%20Park%2C%20Pretoria%2C%200084%2C%20South%20Africa!5e0!3m2!1sen!2sus!4v1778173759856!5m2!1sen!2sus';

const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${LAT},${LNG}`;

// If the iframe hasn't fired its load event by this point, assume the
// embed is unreachable (offline, blocked, captive portal, etc.).
// 15s gives slow connections a reasonable chance to finish loading
// before we surface the offline fallback.
const IFRAME_TIMEOUT_MS = 15_000;

function Reveal({ children, className = '', delay = 0 }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`${className}${visible ? ' visible' : ''}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Offline / unreachable fallback. Static address card so visitors
// always have somewhere to land — even when the embed can't load.
// ─────────────────────────────────────────────────────────────────
function MapOffline({ t, onRetry }) {
  return (
    <div className="map__offline" role="status">
      {/* Decorative grid backdrop hints at "map" without needing the network */}
      <div className="map__offline-grid" aria-hidden="true" />

      <div className="map__offline-card">
        <span className="map__offline-icon" aria-hidden="true">
          {/* The slash overlay lives in CSS — we render the wifi glyph and
              let .map__offline-icon::after stroke through it. Keeps the
              icon swap honest while preserving the original offline mood. */}
          <FontAwesomeIcon icon={faWifi} />
        </span>

        <h3 className="map__offline-title">{t('map.offlineTitle')}</h3>
        <p className="map__offline-desc">{t('map.offlineDesc')}</p>

        <p className="map__offline-address">{t('map.address')}</p>

        <button
          type="button"
          className="map__offline-retry"
          onClick={onRetry}
        >
          <span>{t('map.offlineRetry')}</span>
          <span aria-hidden="true">
            <FontAwesomeIcon icon={faRotateRight} />
          </span>
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Map section — full-bleed embed with offline fallback + closing
// info strip beneath.
// ─────────────────────────────────────────────────────────────────
export default function Map() {
  const { t } = useLang();

  // Online state derives from the browser API. We listen for
  // `online` / `offline` events so the section reacts in real time
  // when connectivity changes (e.g. user reconnects to wifi).
  const [online, setOnline] = useState(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine
  );
  const [embedFailed, setEmbedFailed] = useState(false);
  // Bumping this key remounts the iframe so React requests the embed
  // again from scratch — used by both the auto-retry and the manual
  // "Try again" button.
  const [retryKey, setRetryKey] = useState(0);

  const loadedRef = useRef(false);

  // ── Auto-driven state machine ─────────────────────────────────
  // - offline event → flip to fallback immediately
  // - online  event → reset failure flag + remount iframe so the
  //                   section recovers automatically without any
  //                   user interaction
  useEffect(() => {
    const goOnline = () => {
      setOnline(true);
      setEmbedFailed(false);
      setRetryKey(k => k + 1);
    };
    const goOffline = () => setOnline(false);

    window.addEventListener('online',  goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online',  goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  // Reset the load-tracking + arm the timeout each time the iframe
  // (re)mounts — i.e. whenever `online` flips true or `retryKey` bumps.
  useEffect(() => {
    if (!online) return undefined;
    loadedRef.current = false;
    setEmbedFailed(false);
    const tid = setTimeout(() => {
      if (!loadedRef.current) setEmbedFailed(true);
    }, IFRAME_TIMEOUT_MS);
    return () => clearTimeout(tid);
  }, [online, retryKey]);

  const handleIframeLoad = () => {
    loadedRef.current = true;
    setEmbedFailed(false);
  };

  // Manual retry is only needed for the awkward case where the
  // browser reports "online" but the embed itself can't load
  // (corp proxy, blocked domain, slow CDN). The "Try again" button
  // gives the user an out without reloading the whole page.
  const handleRetry = () => {
    if (typeof navigator !== 'undefined') {
      setOnline(navigator.onLine);
    }
    setEmbedFailed(false);
    setRetryKey(k => k + 1);
  };

  const showFallback = !online || embedFailed;

  return (
    <section id="map" className="map" aria-label={t('map.titleAccent')}>
      <Reveal className="map__frame" delay={0.05}>
        {showFallback ? (
          <MapOffline t={t} onRetry={handleRetry} />
        ) : (
          <>
            <iframe
              key={retryKey}
              title="ICP — 294 Flowers Street, Capital Park, Pretoria, 0084"
              className="map__iframe"
              src={MAP_SRC}
              // NOTE: do NOT set loading="lazy" here. The Map sits at the
              // bottom of Home, so a lazy iframe never starts loading until
              // the user scrolls — but our failure timeout starts on mount.
              // Eager-loading keeps the timeout meaningful (it only fires
              // when the embed has genuinely had a chance to load).
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={handleIframeLoad}
            />

            <a
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="map__pin"
              aria-label={t('map.directionsAria')}
            >
              <span className="map__pin-icon" aria-hidden="true">
                <FontAwesomeIcon icon={faLocationDot} />
              </span>
              <span className="map__pin-text">{t('map.directionsLabel')}</span>
            </a>
          </>
        )}
      </Reveal>

      {/* ── Closing info strip — replaces the role of the old Contact section ── */}
      <Reveal className="map__close" delay={0.1}>
        <p className="map__close-eyebrow">
          <span className="map__close-line" aria-hidden="true" />
          {t('map.closeEyebrow')}
          <span className="map__close-line" aria-hidden="true" />
        </p>

        <div className="map__close-grid">
          <div className="map__close-cell">
            <span className="map__close-label">{t('map.addressLabel')}</span>
            <span className="map__close-value">{t('map.address')}</span>
          </div>

          <div className="map__close-cell">
            <span className="map__close-label">{t('map.hoursLabel')}</span>
            <span className="map__close-value">{t('map.hoursValue')}</span>
          </div>

          <div className="map__close-cell">
            <span className="map__close-label">{t('map.emailLabel')}</span>
            <a
              href={`mailto:${t('map.emailValue')}`}
              className="map__close-value map__close-value--link"
            >
              {t('map.emailValue')}
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

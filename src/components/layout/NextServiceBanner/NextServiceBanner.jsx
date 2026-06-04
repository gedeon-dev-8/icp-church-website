import { useEffect, useState } from 'react';
import { useLang } from '../../../context/LanguageContext';
import { useCountdown, useNextSundayService } from '../../../hooks/useCountdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faChurch } from '@fortawesome/free-solid-svg-icons';
import './NextServiceBanner.scss';

// ────────────────────────────────────────────────────────────────────
// NextServiceBanner — slides in from the top once we hit the second
// half of the week (Wednesday afternoon through Sunday morning) to
// nudge regulars and newcomers about the next Sunday gathering.
//
// Dismissals persist for the rest of the week (sessionStorage keyed
// off the target Sunday's date) so a single "no thanks" sticks until
// the next service window opens.
// ────────────────────────────────────────────────────────────────────

// Show window: Wednesday 12:00 → Sunday 09:00 local time.
function isInShowWindow(now) {
  const day  = now.getDay();   // 0 Sun .. 6 Sat
  const hour = now.getHours();

  if (day === 0) return hour < 9;             // Sunday morning before service
  if (day >= 4)  return true;                 // Thursday, Friday, Saturday
  if (day === 3 && hour >= 12) return true;   // Wednesday from noon
  return false;
}

function dismissKeyForTarget(target) {
  if (!target) return 'icp-next-service-dismiss-none';
  const d = target.toISOString().slice(0, 10);
  return `icp-next-service-dismiss-${d}`;
}

export default function NextServiceBanner() {
  const { t } = useLang();
  // Hook handles both timezone anchoring and rollover when the
  // current service has passed.
  const target = useNextSundayService();
  const { days, hours, minutes, isLive, isStartingSoon } = useCountdown(target);

  // Tick the show-window check every minute so the banner appears
  // automatically when we cross into Wednesday afternoon, without a
  // page reload.
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Per-target dismissal — clearing on a new Sunday is automatic
  // because the key includes the date.
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === 'undefined') return false;
    try { return sessionStorage.getItem(dismissKeyForTarget(target)) === '1'; }
    catch { return false; }
  });

  const handleDismiss = () => {
    setDismissed(true);
    try { sessionStorage.setItem(dismissKeyForTarget(target), '1'); } catch { /* ignore */ }
  };

  const inWindow = isInShowWindow(now);
  const visible = inWindow && !dismissed;
  if (!visible) return null;

  // Copy comes from translations with sensible English fallbacks.
  const next = t('hero.next') || {};
  const labels = t('nextService') || {};

  let timeLine;
  if (isLive) {
    timeLine = labels.live || next.live || 'Live now';
  } else if (isStartingSoon) {
    timeLine = labels.starting || next.starting || 'Starting soon';
  } else if (days === 0) {
    timeLine = `${labels.todayIn || 'Today, in'} ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`;
  } else if (days === 1) {
    timeLine = labels.tomorrow || 'Tomorrow · 09:00';
  } else {
    timeLine = `${labels.inDays?.replace('{n}', days) || `In ${days} days`} · ${next.time || 'Sunday 09:00'}`;
  }

  return (
    <aside
      className={`nsb${isLive ? ' nsb--live' : ''}${isStartingSoon ? ' nsb--soon' : ''}`}
      role="status"
      aria-live="polite"
      aria-label={labels.aria || 'Next Sunday service reminder'}
    >
      <span className="nsb__icon" aria-hidden="true">
        <FontAwesomeIcon icon={faChurch} />
      </span>

      <span className="nsb__text">
        <span className="nsb__title">
          {labels.title || 'See you Sunday'}
        </span>
        <span className="nsb__time">{timeLine}</span>
      </span>

      <a href="/#map" className="nsb__cta">
        <span>{labels.cta || 'Plan your visit'}</span>
        <span aria-hidden="true">→</span>
      </a>

      <button
        type="button"
        className="nsb__dismiss"
        onClick={handleDismiss}
        aria-label={labels.dismiss || 'Dismiss'}
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </aside>
  );
}

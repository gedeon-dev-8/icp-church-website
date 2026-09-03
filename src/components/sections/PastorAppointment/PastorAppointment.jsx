import { useEffect, useRef, useState } from 'react';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { useLang } from '../../../context/LanguageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck, faClock, faPhone, faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';
import './PastorAppointment.scss';

// Single source of truth for the number — used for both the display
// text and the tel: link (which needs the punctuation-free form).
const PHONE_DISPLAY = '+27 81 394 2440';
const PHONE_TEL = '+27813942440';

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

export default function PastorAppointment() {
  const { t } = useLang();
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const handleCopy = async () => {
    if (!navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(PHONE_DISPLAY);
    } catch {
      // Clipboard unavailable — the number is still visible to copy manually.
      return;
    }
    setCopied(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="appointment" className="appt" aria-labelledby="appt-title">
      <Reveal className="appt__card">
        <span className="appt__icon" aria-hidden="true">
          <FontAwesomeIcon icon={faCalendarCheck} />
        </span>

        <div className="appt__text">
          <span className="appt__eyebrow">{t('appointment.eyebrow')}</span>
          <h2 id="appt-title" className="appt__title">{t('appointment.title')}</h2>
          <span className="appt__schedule">
            <FontAwesomeIcon icon={faClock} aria-hidden="true" />
            {t('appointment.schedule')}
          </span>
        </div>

        <div className="appt__actions">
          <a href={`tel:${PHONE_TEL}`} className="appt__call">
            <FontAwesomeIcon icon={faPhone} aria-hidden="true" />
            <span className="appt__call-text">
              <span className="appt__call-label">{t('appointment.callCta')}</span>
              <span className="appt__call-number">{PHONE_DISPLAY}</span>
            </span>
          </a>

          <button
            type="button"
            className={`appt__copy${copied ? ' is-copied' : ''}`}
            onClick={handleCopy}
            aria-label={copied ? t('appointment.copied') : t('appointment.copyNumber')}
          >
            <FontAwesomeIcon icon={copied ? faCheck : faCopy} aria-hidden="true" />
          </button>
        </div>
      </Reveal>
    </section>
  );
}

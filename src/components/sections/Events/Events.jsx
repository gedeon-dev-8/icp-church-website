import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { useLang } from '../../../context/LanguageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import './Events.scss';

// ─────────────────────────────────────────────────────────────────
// Annual-event date helpers
//
// Each event has an eventKey in translations.js. We compute the next
// occurrence at module load — when the page reloads next year, the
// dates have already rolled forward.
// ─────────────────────────────────────────────────────────────────
const DAY_ABBR = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  fr: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
};

const MONTH_ABBR = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  fr: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
};

// Women's Day in South Africa = 9 August (public holiday).
// The Women's Service falls on the Sunday of that week — which boils
// down to "the first Sunday on or after 9 August".
function womensServiceSunday(year) {
  const augNine = new Date(year, 7, 9);                          // Aug = month 7
  const dayOfWeek = augNine.getDay();                            // 0 = Sun
  if (dayOfWeek === 0) return augNine;
  const daysUntilSunday = 7 - dayOfWeek;
  return new Date(year, 7, 9 + daysUntilSunday);
}

// Returns the next future occurrence of an annual event, given a
// builder that takes a year and returns a Date.
function nextOccurrence(builder, now = new Date()) {
  const candidate = builder(now.getFullYear());
  // Treat the event as still "upcoming" through the entire calendar day.
  const endOfDay = new Date(candidate);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay < now ? builder(now.getFullYear() + 1) : candidate;
}

// Map eventKey → next Date object
function getEventDate(eventKey, now = new Date()) {
  switch (eventKey) {
    case 'womens':       return nextOccurrence(womensServiceSunday, now);
    case 'christmas':    return nextOccurrence(year => new Date(year, 11, 25), now);
    case 'newYearsEve':  return nextOccurrence(year => new Date(year, 11, 31), now);
    default:             return null;
  }
}

// Build the {day, dateNum, month} chunks the date-card UI expects
function formatEventDate(date, lang = 'en') {
  if (!date) return { day: '', dateNum: '', month: '' };
  const dayAbbr   = DAY_ABBR[lang]   || DAY_ABBR.en;
  const monthAbbr = MONTH_ABBR[lang] || MONTH_ABBR.en;
  return {
    day:     dayAbbr[date.getDay()],
    dateNum: String(date.getDate()).padStart(2, '0'),
    month:   monthAbbr[date.getMonth()],
  };
}

// ─────────────────────────────────────────────────────────────────
// Reveal wrapper
// ─────────────────────────────────────────────────────────────────
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
// Event row — date card + body. No RSVP button; these are recurring
// annual events that simply happen.
// ─────────────────────────────────────────────────────────────────
function EventRow({ event, delay, lang }) {
  const { ref, visible } = useScrollReveal();

  // Prefer dynamically-computed date when an eventKey is given;
  // fall back to any explicit day/dateNum/month fields on the item.
  const computed = event.eventKey ? getEventDate(event.eventKey) : null;
  const dateInfo = computed
    ? formatEventDate(computed, lang)
    : { day: event.day, dateNum: event.dateNum, month: event.month };

  return (
    <article
      ref={ref}
      className={`event${visible ? ' visible' : ''}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      <div className="event__date">
        <span className="event__day">{dateInfo.day}</span>
        <span className="event__num">{dateInfo.dateNum}</span>
        <span className="event__month">{dateInfo.month}</span>
      </div>

      <div className="event__body">
        <span className="event__badge">{event.badge}</span>
        <h3 className="event__title">{event.title}</h3>
        <p className="event__desc">{event.desc}</p>
        <div className="event__meta">
          <span className="event__meta-item">
            <FontAwesomeIcon icon={faClock} aria-hidden="true" className="event__meta-icon" />
            {event.time}
          </span>
          <span className="event__meta-item">
            <FontAwesomeIcon icon={faLocationDot} aria-hidden="true" className="event__meta-icon" />
            {event.location}
          </span>
        </div>
      </div>
    </article>
  );
}

export default function Events() {
  const { t, lang } = useLang();
  const items = t('events.items') || [];

  return (
    <section id="events" className="events" aria-labelledby="events-title">
      <div className="events__head">
        <Reveal className="events__eyebrow">{t('events.eyebrow')}</Reveal>
        <Reveal className="events__title" delay={0.1}>
          <h2 id="events-title">
            {t('events.titleLine1')} <em>{t('events.titleAccent')}</em>
          </h2>
        </Reveal>
        <Reveal className="events__sub" delay={0.2}>
          {t('events.sub')}
        </Reveal>
      </div>

      <div className="events__list">
        {items.map((e, i) => (
          <EventRow key={e.id} event={e} delay={i * 0.08} lang={lang} />
        ))}
      </div>
    </section>
  );
}

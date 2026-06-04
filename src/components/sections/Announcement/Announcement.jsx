import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { useLang } from '../../../context/LanguageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Announcement.scss';

// ─────────────────────────────────────────────────────────────────
// Reveal helper (kept local so this section is self-contained)
// ─────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────
// One scheduled item — a card with icon, name, when, and optional
// extra line (a second time slot) or a list of cell-group locations.
// ─────────────────────────────────────────────────────────────────
function ItemCard({ item, delay, locationsLabel }) {
  const { t } = useLang();
  const { ref, visible } = useScrollReveal();
  return (
    <article
      ref={ref}
      className={`an-card an-card--${item.id}${visible ? ' visible' : ''}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      <span className="an-card__icon" aria-hidden="true">
        <FontAwesomeIcon icon={item.icon} />
      </span>
      <h3 className="an-card__name">{item.name}</h3>

      <div className="an-card__when">{item.when}</div>
      {item.extra && <div className="an-card__extra">{item.extra}</div>}

      {item.locations && item.locations.length > 0 && (
        <div className="an-card__locations">
          <span className="an-card__locations-label">{locationsLabel}</span>
          <ul className="an-card__location-list">
            {item.locations.map(loc => (
              <li key={loc.name} className="an-card__location">
                {loc.name}
                <span className="an-card__location-time">
                  {loc.day} · {loc.time}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

    </article>
  );
}

// ─────────────────────────────────────────────────────────────────
// One group of items (e.g. "Weekly Gatherings")
// ─────────────────────────────────────────────────────────────────
function Group({ group, locationsLabel, baseDelay = 0 }) {
  return (
    <div className={`an-group an-group--${group.id}`}>
      <Reveal className="an-group__head" delay={baseDelay}>
        <span className="an-group__line" aria-hidden="true" />
        <span className="an-group__title">
          {group.title}
          {group.groupNote && (
            <span className="an-group__note"> · {group.groupNote}</span>
          )}
        </span>
        <span className="an-group__line" aria-hidden="true" />
      </Reveal>

      <div className={`an-group__items an-group__items--${group.id}`}>
        {group.items.map((item, i) => (
          <ItemCard
            key={item.id}
            item={item}
            delay={baseDelay + 0.07 * (i + 1)}
            locationsLabel={locationsLabel}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Main section
// ─────────────────────────────────────────────────────────────────
export default function Announcement() {
  const { t } = useLang();
  const groups = t('announcement.groups') || [];
  const locationsLabel = t('announcement.locationsLabel');

  return (
    <section
      id="announcement"
      className="announce"
      aria-labelledby="announce-title"
    >
      <div className="announce__head">
        <Reveal className="announce__eyebrow">{t('announcement.eyebrow')}</Reveal>
        <Reveal className="announce__title" delay={0.1}>
          <h2 id="announce-title">
            {t('announcement.titleLine1')} <em>{t('announcement.titleAccent')}</em>
          </h2>
        </Reveal>
        <Reveal className="announce__sub" delay={0.2}>
          {t('announcement.sub')}
        </Reveal>
      </div>

      <div className="announce__body">
        {groups.map((g, i) => (
          <Group
            key={g.id}
            group={g}
            locationsLabel={locationsLabel}
            baseDelay={i * 0.05}
          />
        ))}
      </div>
    </section>
  );
}

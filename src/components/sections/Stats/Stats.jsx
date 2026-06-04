import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { useCountUp } from '../../../hooks/useCountUp';
import { useLang } from '../../../context/LanguageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChurch,
  faPeopleGroup,
  faVideo,
  faImages,
} from '@fortawesome/free-solid-svg-icons';
import AnimatedYears, {
  FOUNDING_YEAR,
  STREAMING_SINCE,
} from '../../shared/AnimatedYears';
import { TOTAL_IMAGES } from '../../pages/Gallery/galleryImages';
import './Stats.scss';

// ────────────────────────────────────────────────────────────────────
// Stats band — a small, dignified row of headline numbers that anchor
// ICP's identity. Lives between About and Announcement on the home
// page. Numbers are computed from real data wherever possible:
//
//   Years    → currentYear − FOUNDING_YEAR  (auto-rolls on Jan 1)
//   Photos   → TOTAL_IMAGES from the gallery loader
//   Sermons  → count of items in t('sermons.items')
//   Depts    → count of items in t('departmentsPage.items')
//
// The count-up animation fires when the band scrolls into view.
// ────────────────────────────────────────────────────────────────────

function StatCell({ icon, value, suffix = '', label, sublabel = null, delay = 0 }) {
  const { ref, visible } = useScrollReveal();
  const animated = useCountUp(value, { when: visible });

  return (
    <div
      ref={ref}
      className={`stats__cell${visible ? ' visible' : ''}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      <span className="stats__icon" aria-hidden="true">
        <FontAwesomeIcon icon={icon} />
      </span>
      <span className="stats__num">
        {animated}
        {suffix && <span className="stats__num-suffix">{suffix}</span>}
      </span>
      <span className="stats__label">{label}</span>
      {sublabel && <span className="stats__sublabel">{sublabel}</span>}
    </div>
  );
}

// Curated stat — the public sermon library currently lists 300+ recordings
// across the YouTube channel and archive. Bumped as a single source of
// truth here rather than tying it to the home-page sermon card count.
const SERMONS_ONLINE = 300;

export default function Stats() {
  const { t } = useLang();
  const departments = (t('departmentsPage.items') || []).length;
  const years       = new Date().getFullYear() - FOUNDING_YEAR;

  const labels = t('stats.labels') || {};

  return (
    <section className="stats" aria-label="ICP at a glance">
      <div className="stats__inner">
        <StatCell
          icon={faChurch}
          value={years}
          suffix="+"
          label={labels.years || 'Years of grace'}
          delay={0}
        />
        <StatCell
          icon={faPeopleGroup}
          value={departments}
          label={labels.departments || 'Departments'}
          delay={0.08}
        />
        <StatCell
          icon={faVideo}
          value={SERMONS_ONLINE}
          suffix="+"
          label={labels.sermons || 'Sermons online'}
          sublabel={
            <>
              <AnimatedYears since={STREAMING_SINCE} />
              {' '}
              {labels.streamingSince || 'years streaming online'}
            </>
          }
          delay={0.16}
        />
        <StatCell
          icon={faImages}
          value={TOTAL_IMAGES}
          suffix="+"
          label={labels.photos || 'Photos archived'}
          delay={0.24}
        />
      </div>
    </section>
  );
}

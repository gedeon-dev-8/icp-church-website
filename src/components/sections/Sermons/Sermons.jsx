import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { useLang } from '../../../context/LanguageContext';
import { useYouTubeMeta } from '../../../hooks/useYouTubeMeta';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faVideo } from '@fortawesome/free-solid-svg-icons';
import EmptyState from '../../shared/EmptyState/EmptyState';
import './Sermons.scss';

// YouTube ships a high-res thumbnail at a predictable URL for every
// public video — we use this as an instant fallback while the
// oEmbed proxy responds (and as the only source if oEmbed fails).
function youtubeThumbFor(videoId) {
  return videoId
    ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    : '';
}

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
// Sermon card — clicking opens the specific YouTube video in a new
// tab. The URL is built from `sermon.youtubeId`, so editing IDs in
// translations.js (SERMON_REFS) is the single source of truth.
//
// Title comes from the curated translation entry (we control the
// format, so the speaker never leaks into the heading — they have
// their own `.sermon__speaker` line below).
//
// Thumbnail is pulled live from YouTube via oEmbed when possible —
// that's the thing admins most often forget to update. Fallbacks:
//   1. the translation-provided thumbnail, then
//   2. YouTube's predictable hqdefault thumbnail URL.
// ─────────────────────────────────────────────────────────────────
function SermonCard({ sermon, delay, t }) {
  const { ref, visible } = useScrollReveal();
  const { meta } = useYouTubeMeta(sermon.youtubeId);

  const url = `https://www.youtube.com/watch?v=${sermon.youtubeId}`;
  const title = sermon.title;
  const liveThumb =
    meta?.thumbnail ||
    sermon.thumbnail ||
    youtubeThumbFor(sermon.youtubeId);

  return (
    <article
      ref={ref}
      className={`sermon${visible ? ' visible' : ''}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="sermon__media"
        aria-label={`${t('sermons.watchAria')}: ${title}`}
      >
        <img
          src={liveThumb}
          alt=""
          loading="lazy"
          decoding="async"
          className="sermon__thumb"
        />
        <span className="sermon__play" aria-hidden="true">
          <FontAwesomeIcon icon={faPlay} />
        </span>
        {sermon.duration && (
          <span className="sermon__duration">{sermon.duration}</span>
        )}
      </a>

      <div className="sermon__body">
        <div className="sermon__date">{sermon.date}</div>
        <h3 className="sermon__title">{title}</h3>
        <div className="sermon__speaker">{sermon.speaker}</div>
      </div>
    </article>
  );
}

export default function Sermons() {
  const { t } = useLang();
  const items = t('sermons.items') || [];

  return (
    <section id="sermons" className="sermons" aria-labelledby="sermons-title">
      <div className="sermons__head">
        <Reveal className="sermons__eyebrow">{t('sermons.eyebrow')}</Reveal>
        <Reveal className="sermons__title" delay={0.1}>
          <h2 id="sermons-title">
            {t('sermons.titleLine1')} <em>{t('sermons.titleAccent')}</em>
          </h2>
        </Reveal>
        <Reveal className="sermons__sub" delay={0.2}>
          {t('sermons.sub')}
        </Reveal>
      </div>

      {items.length > 0 ? (
        <div className="sermons__grid">
          {items.map((s, i) => (
            <SermonCard key={s.id} sermon={s} delay={i * 0.1} t={t} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={faVideo}
          title={t('sermons.emptyTitle') || 'No sermons just yet'}
          description={
            t('sermons.emptyDesc') ||
            'Our team is curating this archive. Tune in on YouTube in the meantime.'
          }
          action={{
            label: t('sermons.cta') || 'Visit YouTube',
            href: 'https://www.youtube.com/channel/UCO5cyDDRu-jZA7oMKGqRIMg',
            external: true,
          }}
        />
      )}

      <Reveal className="sermons__more" delay={0.3}>
        <a
          href="https://www.youtube.com/channel/UCO5cyDDRu-jZA7oMKGqRIMg"
          target="_blank"
          rel="noopener noreferrer"
          className="sermons__more-btn"
        >
          <span>{t('sermons.cta')}</span>
          <span aria-hidden="true">→</span>
        </a>
      </Reveal>
    </section>
  );
}

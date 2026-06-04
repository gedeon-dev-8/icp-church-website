import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCross, faUsers, faLeaf } from '@fortawesome/free-solid-svg-icons';
import { useLang } from '../../../context/LanguageContext';
import AnimatedYears from '../../shared/AnimatedYears';

import './About.scss';

const VALUE_ICONS = [faCross, faUsers, faLeaf];

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

// Render a paragraph that may contain **bold** segments.
function MarkdownPara({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**') ? (
          <strong key={i}>{p.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </p>
  );
}

export default function About() {
  const { t } = useLang();
  const body = t('about.body') || [];
  const values = t('about.values') || [];

  return (
    <section id="about" className="about" aria-labelledby="about-title">
      {/* ── Visual column ── */}
      <Reveal className="about__visual">
        <div className="about__offset" />
        <div className="about__frame">
          <div className="about__corner">
            <div className="about__bracket about__bracket--tl" />
            <div className="about__bracket about__bracket--tr" />
            <div className="about__bracket about__bracket--bl" />
            <div className="about__bracket about__bracket--br" />
          </div>
          <div className="about__frame-inner" />
        </div>
        <div className="about__badge">
          <AnimatedYears className="about__badge-num" />
          <span className="about__badge-label">{t('about.badgeLabel')}</span>
        </div>
      </Reveal>

      {/* ── Content column ── */}
      <div className="about__content">
        <Reveal className="about__eyebrow">{t('about.eyebrow')}</Reveal>

        <Reveal className="about__title" delay={0.1}>
          <h2 id="about-title">
            {t('about.titleLine1')}<br /><em>{t('about.titleAccent')}</em>
          </h2>
        </Reveal>

        <Reveal className="about__body" delay={0.2}>
          {body.map((p, i) => <MarkdownPara key={i} text={p} />)}
        </Reveal>

        {t('about.pullQuote') && (
          <Reveal className="about__pullquote" delay={0.25}>
            <blockquote>{t('about.pullQuote')}</blockquote>
          </Reveal>
        )}

        <Reveal className="about__values" delay={0.3}>
          {values.map((v, i) => (
            <div key={v.title} className="about__value">
              <div className="about__value-icon" aria-hidden="true">
                <FontAwesomeIcon icon={VALUE_ICONS[i]} />
              </div>
              <div>
                <div className="about__value-title">{v.title}</div>
                <div className="about__value-desc">{v.desc}</div>
              </div>
            </div>
          ))}
        </Reveal>

        <Reveal delay={0.4}>
          {/* Contact section was removed — open the user's mail client directly. */}
          <a href="mailto:info@icpretoria.org" className="about__cta">
            <span>{t('about.cta')}</span>
            <span aria-hidden="true">→</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}

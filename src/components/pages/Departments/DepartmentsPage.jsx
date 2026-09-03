import { useEffect } from 'react';
import { usePageTheme } from '../../../hooks/usePageTheme';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { useLang } from '../../../context/LanguageContext';
import SmartNavLink from '../../layout/Navbar/SmartNavLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './DepartmentsPage.scss';

function Reveal({ children, className = '', delay = 0, tag: Tag = 'div', id }) {
  const { ref, visible } = useScrollReveal();
  return (
    <Tag
      ref={ref}
      id={id}
      className={`${className}${visible ? ' visible' : ''}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </Tag>
  );
}

// ─────────────────────────────────────────────────────────────────
// One department card. No per-card "Join this team" CTA — the page
// has a single Take-the-next-step band at the bottom instead.
// ─────────────────────────────────────────────────────────────────
function DepartmentCard({ dept, scheduleLabel, delay }) {
  const { ref, visible } = useScrollReveal();
  return (
    <article
      ref={ref}
      id={`dept-${dept.id}`}
      className={`dept-card${visible ? ' visible' : ''}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      <span className="dept-card__icon" aria-hidden="true">
        <FontAwesomeIcon icon={dept.icon} />
      </span>
      <h3 className="dept-card__title">{dept.title}</h3>
      <p className="dept-card__desc">{dept.description}</p>

      {dept.schedule && (
        <div className="dept-card__schedule">
          <span className="dept-card__schedule-label">{scheduleLabel}</span>
          <p className="dept-card__schedule-value">{dept.schedule}</p>
        </div>
      )}
    </article>
  );
}

export default function DepartmentsPage() {
  const { t } = useLang();

  // Update <title> for screen readers / browser tab
  useEffect(() => {
    const original = document.title;
    document.title = `${t('departmentsPage.metaTitle')} — ICP`;
    return () => { document.title = original; };
  }, [t]);

  const items = t('departmentsPage.items') || [];
  const scheduleLabel = t('departmentsPage.scheduleLabel');

  usePageTheme('departments');

  return (
    <main id="main" tabIndex="-1" className="departments-page">
      {/* ── Hero header ── */}
      <header className="dept-hero" aria-labelledby="dept-page-title">
        <div className="dept-hero__veil" aria-hidden="true" />
        <div className="dept-hero__inner">
          <Reveal className="dept-hero__eyebrow">{t('departmentsPage.eyebrow')}</Reveal>
          <Reveal tag="h1" className="dept-hero__title" delay={0.1} id="dept-page-title">
            {t('departmentsPage.titleLine1')} <em>{t('departmentsPage.titleAccent')}</em>
          </Reveal>
          <Reveal className="dept-hero__sub" delay={0.2}>
            {t('departmentsPage.sub')}
          </Reveal>
        </div>
      </header>

      {/* ── Card grid ── */}
      <section className="dept-grid" aria-label="Departments">
        {items.map((dept, i) => (
          <DepartmentCard
            key={dept.id}
            dept={dept}
            scheduleLabel={scheduleLabel}
            // Stagger reveal within each row (3-col desktop, 2-col tablet, 1-col mobile)
            delay={(i % 3) * 0.06}
          />
        ))}
      </section>

      {/* ── Final CTA band ── */}
      <section className="dept-final" aria-labelledby="dept-final-title">
        <div className="dept-final__inner">
          <Reveal className="dept-final__eyebrow">{t('departmentsPage.finalEyebrow')}</Reveal>
          <Reveal tag="h2" className="dept-final__title" delay={0.1} id="dept-final-title">
            <em>{t('departmentsPage.finalTitle')}</em>
          </Reveal>
          <Reveal className="dept-final__sub" delay={0.2}>
            {t('departmentsPage.finalSub')}
          </Reveal>
          <Reveal className="dept-final__cta" delay={0.3}>
            <SmartNavLink href="/#map" className="dept-final__btn dept-final__btn--primary">
              <span>{t('departmentsPage.finalCtaPrimary')}</span>
              <span aria-hidden="true">→</span>
            </SmartNavLink>
            <a href="mailto:icpeip012@gmail.com" className="dept-final__btn dept-final__btn--ghost">
              {t('departmentsPage.finalCtaSecondary')}
            </a>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

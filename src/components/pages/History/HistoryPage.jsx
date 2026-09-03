import { Fragment, useEffect } from 'react';
import { usePageTheme } from '../../../hooks/usePageTheme';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { useLang } from '../../../context/LanguageContext';
import SmartNavLink from '../../layout/Navbar/SmartNavLink';
import FOUNDER_IMG from '../../../assets/images/About-Images/1.png';
import './HistoryPage.scss';

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

export default function HistoryPage() {
  const { t } = useLang();

  useEffect(() => {
    const original = document.title;
    document.title = `${t('historyPage.metaTitle')} — ICP`;
    return () => { document.title = original; };
  }, [t]);

  usePageTheme('history');

  const sections = t('historyPage.sections') || [];
  const leadership = t('historyPage.leadership') || [];

  return (
    <main id="main" tabIndex="-1" className="history-page">
      {/* ── Hero header ── */}
      <header className="history-hero" aria-labelledby="history-page-title">
        <div className="history-hero__veil" aria-hidden="true" />
        <div className="history-hero__inner">
          <Reveal className="history-hero__eyebrow">{t('historyPage.eyebrow')}</Reveal>
          <Reveal tag="h1" className="history-hero__title" delay={0.1} id="history-page-title">
            {t('historyPage.titleLine1')} <em>{t('historyPage.titleAccent')}</em>
          </Reveal>
          <Reveal className="history-hero__sub" delay={0.2}>
            {t('historyPage.sub')}
          </Reveal>
        </div>
      </header>

      {/* ── Narrative chapters ── */}
      <section className="history-narrative" aria-label={t('historyPage.metaTitle')}>
        <div className="history-narrative__inner">
          {sections.map((s, i) => (
            <Reveal
              key={s.heading}
              tag="article"
              className="history-chapter"
              delay={(i % 3) * 0.08}
            >
              <span className="history-chapter__num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h2 className="history-chapter__heading">{s.heading}</h2>
              <p className="history-chapter__body">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Founding Pastor spotlight ── */}
      <section className="history-founder" aria-labelledby="history-founder-title">
        <div className="history-founder__inner">
          <Reveal className="history-founder__visual">
            <div className="history-founder__offset" />
            <div className="history-founder__frame">
              <img
                src={FOUNDER_IMG}
                alt={t('historyPage.founder.name')}
                className="history-founder__photo"
                loading="lazy"
                decoding="async"
              />
              <div className="history-founder__corner">
                <div className="history-founder__bracket history-founder__bracket--tl" />
                <div className="history-founder__bracket history-founder__bracket--tr" />
                <div className="history-founder__bracket history-founder__bracket--bl" />
                <div className="history-founder__bracket history-founder__bracket--br" />
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal className="history-founder__eyebrow">{t('historyPage.founder.eyebrow')}</Reveal>
            <Reveal tag="h2" className="history-founder__title" delay={0.1} id="history-founder-title">
              {t('historyPage.founder.name')}
            </Reveal>
            <Reveal tag="span" className="history-founder__role" delay={0.15}>
              {t('historyPage.founder.role')}
            </Reveal>
            <Reveal className="history-founder__body" delay={0.2}>
              {(t('historyPage.founder.body') || []).map((p, i) => <p key={i}>{p}</p>)}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Closing statement ── */}
      <section className="history-closing" aria-label={t('historyPage.closingStatement')}>
        <Reveal tag="span" className="history-closing__line" />
        <Reveal tag="blockquote" className="history-closing__text" delay={0.1}>
          <span className="history-closing__mark" aria-hidden="true">“</span>
          {t('historyPage.closingStatement')}
          <span className="history-closing__mark" aria-hidden="true">”</span>
        </Reveal>
      </section>

      {/* ── Pastoral leadership lineage ── */}
      {leadership.length > 0 && (
        <section className="history-leadership" aria-label={t('historyPage.leadershipLabel')}>
          <Reveal className="history-leadership__label">{t('historyPage.leadershipLabel')}</Reveal>
          <div className="history-leadership__row">
            {leadership.map((p, i) => {
              const content = (
                <>
                  <span className="history-leader__years">{p.years}</span>
                  <span className="history-leader__name">{p.name}</span>
                  <span className="history-leader__role">{p.role}</span>
                </>
              );
              return (
                <Fragment key={p.name}>
                  {i > 0 && (
                    <span className="history-leadership__arrow" aria-hidden="true">→</span>
                  )}
                  <Reveal tag="div" className="history-leader-wrap" delay={i * 0.1}>
                    {p.href ? (
                      <SmartNavLink href={p.href} className="history-leader history-leader--link">
                        {content}
                      </SmartNavLink>
                    ) : (
                      <div className="history-leader">{content}</div>
                    )}
                  </Reveal>
                </Fragment>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Final CTA band ── */}
      <section className="history-final" aria-labelledby="history-final-title">
        <div className="history-final__inner">
          <Reveal className="history-final__eyebrow">{t('historyPage.finalEyebrow')}</Reveal>
          <Reveal tag="h2" className="history-final__title" delay={0.1} id="history-final-title">
            <em>{t('historyPage.finalTitle')}</em>
          </Reveal>
          <Reveal className="history-final__sub" delay={0.2}>
            {t('historyPage.finalSub')}
          </Reveal>
          <Reveal className="history-final__cta" delay={0.3}>
            <SmartNavLink href="/#map" className="history-final__btn history-final__btn--primary">
              <span>{t('historyPage.finalCtaPrimary')}</span>
              <span aria-hidden="true">→</span>
            </SmartNavLink>
            <a href="mailto:icpeip012@gmail.com" className="history-final__btn history-final__btn--ghost">
              {t('historyPage.finalCtaSecondary')}
            </a>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

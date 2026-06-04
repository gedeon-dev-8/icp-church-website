import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { useLang } from '../../../context/LanguageContext';
import './Scripture.scss';

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

export default function Scripture() {
  const { t } = useLang();

  return (
    <section
      id="scripture"
      className="scripture"
      aria-labelledby="scripture-theme"
    >
      <Reveal tag="span" className="scripture__line" />

      {/* ── Theme of the Year preamble ── */}
      <Reveal className="scripture__theme" delay={0.05}>
        <span className="scripture__theme-label">
          {t('scripture.themeLabel')}
        </span>
        <span id="scripture-theme" className="scripture__theme-title">
          “{t('scripture.themeTitle')}”
        </span>
      </Reveal>

      {/* ── The verse, with two highlighted phrases ── */}
      <Reveal tag="blockquote" className="scripture__text" delay={0.18}>
        <span className="scripture__quote-mark" aria-hidden="true">“</span>
        {t('scripture.quotePart1')}
        <span className="word">{t('scripture.quoteAccent1')}</span>
        {t('scripture.quotePart2')}
        <span className="word">{t('scripture.quoteAccent2')}</span>
        {t('scripture.quotePart3')}
        <span className="scripture__quote-mark" aria-hidden="true">”</span>
      </Reveal>

      <Reveal className="scripture__ref" delay={0.28}>
        {t('scripture.ref')}
      </Reveal>
    </section>
  );
}

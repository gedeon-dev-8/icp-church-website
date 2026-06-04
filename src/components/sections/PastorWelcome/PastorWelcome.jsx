import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { useLang } from '../../../context/LanguageContext';
import './PastorWelcome.scss';

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

export default function PastorWelcome() {
  const { t } = useLang();

  return (
    <section className="welcome" aria-labelledby="welcome-title">
      <div className="welcome__inner">
        <Reveal className="welcome__eyebrow">{t('welcome.eyebrow')}</Reveal>

        <Reveal tag="h2" className="welcome__title" delay={0.1} id="welcome-title">
          {t('welcome.titleLine1')} <em>{t('welcome.titleAccent')}</em> {t('welcome.titleLine2')}
        </Reveal>

        <Reveal className="welcome__body" delay={0.2}>
          <p>{t('welcome.body')}</p>
        </Reveal>

        <Reveal className="welcome__sign" delay={0.3}>
          <div className="welcome__sign-line" aria-hidden="true" />
          <div className="welcome__sign-name">{t('welcome.signName')}</div>
          <div className="welcome__sign-role">{t('welcome.signRole')}</div>
        </Reveal>
      </div>
    </section>
  );
}

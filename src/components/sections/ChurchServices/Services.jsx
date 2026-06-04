import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { useLang } from '../../../context/LanguageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Services.scss';

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

export default function Services() {
  const { t } = useLang();
  const items = t('services.items') || [];

  return (
    <section id="services" className="services" aria-labelledby="services-title">
      <div className="services__head">
        <Reveal className="services__eyebrow">{t('services.eyebrow')}</Reveal>
        <Reveal className="services__title" delay={0.1}>
          <h2 id="services-title">
            {t('services.titleLine1')} <em>{t('services.titleAccent')}</em>
          </h2>
        </Reveal>
        <Reveal className="services__sub" delay={0.2}>
          {t('services.sub')}
        </Reveal>
      </div>

      <div className="services__grid">
        {items.map((svc, i) => (
          <ServiceCard key={svc.num} svc={svc} delay={(i % 3) * 0.1} />
        ))}
      </div>
    </section>
  );
}

function ServiceCard({ svc, delay }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`svc-card${visible ? ' visible' : ''}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      <span className="svc-card__num">{svc.num}</span>
      <span className="svc-card__icon" aria-hidden="true">
        {svc.icon && <FontAwesomeIcon icon={svc.icon} />}
      </span>
      <div className="svc-card__name">{svc.name}</div>
      <div className="svc-card__badge">{svc.time}</div>
      <p className="svc-card__desc">{svc.desc}</p>
    </div>
  );
}

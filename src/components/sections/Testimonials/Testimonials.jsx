import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { useLang } from '../../../context/LanguageContext';
import './Testimonials.scss';

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

function Testimonial({ item, delay }) {
  const { ref, visible } = useScrollReveal();
  return (
    <figure
      ref={ref}
      className={`testimonial${visible ? ' visible' : ''}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      <span className="testimonial__quote-mark" aria-hidden="true">“</span>
      <blockquote className="testimonial__quote">{item.quote}</blockquote>
      <figcaption className="testimonial__attrib">
        <span className="testimonial__avatar" aria-hidden="true">{item.initial}</span>
        <span className="testimonial__attrib-text">
          <span className="testimonial__name">{item.name}</span>
          <span className="testimonial__role">{item.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export default function Testimonials() {
  const { t } = useLang();
  const items = t('testimonials.items') || [];

  return (
    <section
      id="testimonials"
      className="testimonials"
      aria-labelledby="testimonials-title"
    >
      <div className="testimonials__head">
        <Reveal className="testimonials__eyebrow">{t('testimonials.eyebrow')}</Reveal>
        <Reveal className="testimonials__title" delay={0.1}>
          <h2 id="testimonials-title">
            {t('testimonials.titleLine1')} <em>{t('testimonials.titleAccent')}</em>
          </h2>
        </Reveal>
        <Reveal className="testimonials__sub" delay={0.2}>
          {t('testimonials.sub')}
        </Reveal>
      </div>

      <div className="testimonials__grid">
        {items.map((item, i) => (
          <Testimonial key={item.id} item={item} delay={i * 0.1} />
        ))}
      </div>
    </section>
  );
}

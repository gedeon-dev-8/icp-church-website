import { useScrollReveal } from "../../../hooks/useScrollReveal";
import { useLang } from "../../../context/LanguageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import PASTOR_IMG from "../../../assets/images/Hero-Images/18.png";
import "./PastorWelcome.scss";

function Reveal({ children, className = "", delay = 0 }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`${className}${visible ? " visible" : ""}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

export default function PastorWelcome() {
  const { t } = useLang();
  const body = t("welcome.body") || [];

  return (
    <section id="pastor-welcome" className="welcome" aria-labelledby="welcome-title">
      <div className="welcome__inner">
        {/* ── Content column ── */}
        <div className="welcome__content">
          <Reveal className="welcome__eyebrow">{t("welcome.eyebrow")}</Reveal>

          <Reveal className="welcome__title" delay={0.1}>
            <h2 id="welcome-title">
              {t("welcome.titleLine1")} <em>{t("welcome.titleAccent")}</em>
            </h2>
          </Reveal>

          <Reveal className="welcome__body" delay={0.2}>
            {body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </Reveal>

          {t("welcome.pullQuote") && (
            <Reveal className="welcome__pullquote" delay={0.25}>
              <blockquote>{t("welcome.pullQuote")}</blockquote>
            </Reveal>
          )}

          <Reveal delay={0.3}>
            <a href="#pastoral-team" className="welcome__cta">
              <span>{t("welcome.cta")}</span>
              <span aria-hidden="true">→</span>
            </a>
          </Reveal>
        </div>

        {/* ── Visual column ── */}
        <Reveal className="welcome__visual" delay={0.15}>
          <div className="welcome__offset" />
          <div className="welcome__frame">
            <img
              src={PASTOR_IMG}
              alt={`${t("welcome.titleLine1")} ${t("welcome.titleAccent")}`}
              className="welcome__photo"
              loading="lazy"
              decoding="async"
            />
            <div className="welcome__corner">
              <div className="welcome__bracket welcome__bracket--tl" />
              <div className="welcome__bracket welcome__bracket--tr" />
              <div className="welcome__bracket welcome__bracket--bl" />
              <div className="welcome__bracket welcome__bracket--br" />
            </div>
          </div>
          <div className="welcome__badge">
            <FontAwesomeIcon icon={faQuoteLeft} className="welcome__badge-icon" aria-hidden="true" />
            <span className="welcome__badge-label">{t("welcome.role")}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import { LOGO_B64 } from '../../../assets/logo';
import { useLang } from '../../../context/LanguageContext';
import SmartNavLink from '../Navbar/SmartNavLink';
import AnimatedYears, { FOUNDING_YEAR } from '../../shared/AnimatedYears';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebookF,
  faYoutube,
  faInstagram,
  faTiktok,
} from '@fortawesome/free-brands-svg-icons';

import './Footer.scss';

const SOCIALS = [
  { href: 'https://www.facebook.com/profile.php?id=61566927647820',           label: 'ICP on Facebook',  icon: faFacebookF },
  { href: 'https://www.tiktok.com/@international_church',label: 'ICP on TikTok',    icon: faTiktok    },
  { href: 'https://www.youtube.com/@internationalchurchofpreto9',  label: 'ICP on YouTube',   icon: faYoutube   },
  { href: 'https://www.instagram.com/international_church_of_pta', label: 'ICP on Instagram', icon: faInstagram },
];

export default function Footer() {
  const { lang, setLang, t } = useLang();
  const year = new Date().getFullYear();
  const cols = t('footer.cols') || [];
  const copy = (t('footer.copy') || '').replace('{year}', year);

  return (
    <footer className="footer" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Site footer</h2>
      <div className="footer__grid">
        {/* ── Brand ── */}
        <div>
          <SmartNavLink href="/" className="footer__brand-logo" aria-label={`ICP — ${t('nav.home')}`}>
            <img src={LOGO_B64} alt="" className="footer__brand-img" aria-hidden="true" />
            <div>
              <div className="footer__brand-name">{t('footer.brandName')}</div>
              <div className="footer__brand-sub">{t('footer.brandSub')}</div>
            </div>
          </SmartNavLink>
          <p className="footer__brand-text">{t('footer.brandText')}</p>

          {/* Anniversary tag — animates on scroll like the About badge. */}
          <p className="footer__brand-tag">
            <span className="footer__brand-tag-est">
              {t('footer.estLabel') || 'Est.'} {FOUNDING_YEAR}
            </span>
            <span className="footer__brand-tag-sep" aria-hidden="true">·</span>
            <span className="footer__brand-tag-years">
              <AnimatedYears className="footer__brand-tag-num" />{' '}
              {t('footer.yearsLabel') || 'years of grace'}
            </span>
          </p>
        </div>

        {/* ── Link columns ── */}
        {cols.map(col => (
          <nav key={col.title} aria-label={col.title}>
            <div className="footer__col-head">{col.title}</div>
            <ul className="footer__links">
              {col.links.map(link => (
                <li key={link.label + link.href}>
                  <SmartNavLink href={link.href} className="footer__link">
                    {link.label}
                  </SmartNavLink>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        {/* ── Language & Social ── */}
        <div>
          <div className="footer__col-head">{t('footer.languageHead')}</div>
          <div className="footer__lang-btns">
            <button
              type="button"
              className={`footer__lang-btn${lang === 'en' ? ' is-active' : ''}`}
              onClick={() => setLang('en')}
            >
              {t('common.en')}
            </button>
            <button
              type="button"
              className={`footer__lang-btn${lang === 'fr' ? ' is-active' : ''}`}
              onClick={() => setLang('fr')}
            >
              {t('common.fr')}
            </button>
          </div>

          <div className="footer__col-head" style={{ marginTop: '1.8rem' }}>{t('footer.followHead')}</div>
          <div className="footer__socials">
            {SOCIALS.map(s => (
              <a
                key={s.label}
                href={s.href}
                className="footer__social"
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={s.icon} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <span className="footer__copy">{copy}</span>
        <div className="footer__divider" aria-hidden="true">✦</div>
      </div>
    </footer>
  );
}

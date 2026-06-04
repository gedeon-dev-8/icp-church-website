import { useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { useLang } from '../../../context/LanguageContext';
import SmartNavLink from '../Navbar/SmartNavLink';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import {
  faFacebookF,
  faYoutube,
  faInstagram,
  faTiktok,
} from '@fortawesome/free-brands-svg-icons';

import './MobileMenu.scss';

// Keep social URLs in sync with Footer.jsx — single source of truth could
// later live in translations.js but for now this small mirror is enough.
const SOCIALS = [
  { href: 'https://facebook.com/groups/263029040408370',          label: 'ICP on Facebook',  icon: faFacebookF },
  { href: 'https://youtube.com/channel/UCO5cyDDRu-jZA7oMKGqRIMg', label: 'ICP on YouTube',   icon: faYoutube  },
  { href: 'https://instagram.com/icp.content',                    label: 'ICP on Instagram', icon: faInstagram },
  { href: 'https://tiktok.com/@icp.content',                      label: 'ICP on TikTok',    icon: faTiktok    },
];

export default function MobileMenu({ open, onClose, links = [], isLinkActive = () => false }) {
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLang();

  // Lock scroll & close on Escape when open
  useEffect(() => {
    if (!open) return;
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <div
      id="mobile-menu"
      className={`mobile-menu${open ? ' mobile-menu--open' : ''}`}
      aria-hidden={!open}
      role="dialog"
      aria-modal={open ? 'true' : undefined}
      aria-label="Site navigation"
    >
      <nav aria-label="Mobile">
        {links.map(link => (
          <SmartNavLink
            key={link.key}
            href={link.href}
            className="mobile-menu__link"
            activeClassName="mobile-menu__link--active"
            isActive={isLinkActive(link)}
            onClick={onClose}
            tabIndex={open ? 0 : -1}
          >
            {link.label}
          </SmartNavLink>
        ))}
      </nav>

      <div className="mobile-menu__controls">
        <button
          type="button"
          className="mobile-menu__toggle"
          onClick={toggleLang}
          tabIndex={open ? 0 : -1}
          aria-label={lang === 'en' ? t('common.switchToFr') : t('common.switchToEn')}
        >
          <span className={lang === 'en' ? 'is-active' : ''}>EN</span>
          <span aria-hidden="true">·</span>
          <span className={lang === 'fr' ? 'is-active' : ''}>FR</span>
        </button>

        <button
          type="button"
          className="mobile-menu__toggle mobile-menu__toggle--theme"
          onClick={toggleTheme}
          tabIndex={open ? 0 : -1}
          aria-label={theme === 'dark' ? t('common.switchToLight') : t('common.switchToDark')}
        >
          <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
        </button>
      </div>

      <div className="mobile-menu__footer">
        {SOCIALS.map(s => (
          <a
            key={s.label}
            href={s.href}
            className="mobile-menu__social"
            aria-label={s.label}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={open ? 0 : -1}
          >
            <FontAwesomeIcon icon={s.icon} />
          </a>
        ))}
      </div>
    </div>
  );
}

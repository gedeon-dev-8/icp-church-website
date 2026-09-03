import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { LOGO_B64 } from '../../../assets/logo';
import { useTheme } from '../../../context/ThemeContext';
import { useLang } from '../../../context/LanguageContext';
import { useNavScroll } from '../../../hooks/useNavScroll';
import { useActiveSection } from '../../../hooks/useActiveSection';

import SmartNavLink from './SmartNavLink';
import MobileMenu from '../MobileMenu/MobileMenu';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

import './Navbar.scss';

// ID of every observable section on the home page.
const HOME_SECTION_IDS = ['hero', 'about', 'announcement', 'sermons', 'events', 'map', 'contact'];

const buildLinks = (t) => [
  { key: 'home',         label: t('nav.home'),         href: '/#hero',         sectionId: 'hero',         type: 'hash'  },
  { key: 'about',        label: t('nav.about'),        href: '/#about',        sectionId: 'about',        type: 'hash'  },
  { key: 'announcement', label: t('nav.announcement'), href: '/#announcement', sectionId: 'announcement', type: 'hash'  },
  { key: 'sermons',      label: t('nav.sermons'),      href: '/#sermons',      sectionId: 'sermons',      type: 'hash'  },
  { key: 'events',       label: t('nav.events'),       href: '/#events',       sectionId: 'events',       type: 'hash'  },
  // { key: 'departments',  label: t('nav.departments'),  href: '/departments',   type: 'route' },
  // { key: 'gallery',      label: t('nav.gallery'),      href: '/gallery',       type: 'route' },
  { key: 'visit',        label: t('nav.visit'),        href: '/#map',          sectionId: 'map',          type: 'hash'  },
  { key: 'contact',      label: t('nav.contact'),      href: '/#contact',      sectionId: 'contact',      type: 'hash'  },
  { key: 'give',         label: t('nav.give'),         href: '/give',             type: 'route' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLang();
  const scrolled = useNavScroll(60);
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = useMemo(() => buildLinks(t), [t, lang]);

  const isHome = location.pathname === '/';
  // Only observe sections when on home (otherwise no sections exist)
  const activeSection = useActiveSection(isHome ? HOME_SECTION_IDS : []);

  const isLinkActive = (link) => {
    if (link.type === 'route') return location.pathname === link.href;
    if (!isHome) return false;
    return activeSection === link.sectionId;
  };

  const closeMenu = () => setMenuOpen(false);

  const themeAria = theme === 'dark' ? t('common.switchToLight') : t('common.switchToDark');
  const langAria  = lang === 'en'    ? t('common.switchToFr')    : t('common.switchToEn');

  return (
    <>
      <nav 
        className={`nav${scrolled ? ' nav--scrolled' : ''}`}
        aria-label={t('nav.home')}
      >
        <SmartNavLink href="/" className="nav__logo" aria-label={`ICP — ${t('nav.home')}`}>
          <img src={LOGO_B64} alt="" className="nav__logo-img" aria-hidden="true" />
          <span className="sr-only">International Church of Pretoria</span>
        </SmartNavLink>

        <ul className="nav__links">
          {links.map(link => (
            <li key={link.key}>
              <SmartNavLink
                href={link.href}
                className="nav__link"
                activeClassName="nav__link--active"
                isActive={isLinkActive(link)}
              >
                {link.label}
              </SmartNavLink>
            </li>
          ))}
        </ul>

        <div className="nav__right">
          <button
            className="nav__lang"
            type="button"
            onClick={toggleLang}
            aria-label={langAria}
            title={langAria}
          >
            <span className={`nav__lang-opt${lang === 'en' ? ' is-active' : ''}`}>EN</span>
            <span className="nav__lang-divider" aria-hidden="true">·</span>
            <span className={`nav__lang-opt${lang === 'fr' ? ' is-active' : ''}`}>FR</span>
          </button>

          {/* Theme toggle button is currently disabled because the theme is hardcoded to 'light' in ThemeContext.jsx. If you want to enable it, you can uncomment the theme state initialization in ThemeContext.jsx and adjust the logic accordingly. */}
          <button
            className="nav__toggle"
            onClick={toggleTheme}
            aria-label={themeAria}
            title={themeAria}
            type="button"
          >
            <span className="nav__toggle-icon nav__toggle-icon--dark" aria-hidden="true">
              <FontAwesomeIcon icon={faSun} />
            </span>
            <span className="nav__toggle-icon nav__toggle-icon--light" aria-hidden="true">
              <FontAwesomeIcon icon={faMoon} />
            </span>
          </button>

          <button
            className={`nav__hamburger${menuOpen ? ' nav__hamburger--open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            type="button"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <MobileMenu open={menuOpen} onClose={closeMenu} links={links} isLinkActive={isLinkActive} />
    </>
  );
}

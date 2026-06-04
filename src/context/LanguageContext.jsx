import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { TRANSLATIONS } from '../i18n/translations';

const LanguageContext = createContext();

const SAFE = (val, fallback) => (val === undefined || val === null ? fallback : val);

function getByPath(obj, path) {
  if (!path) return undefined;
  return path.split('.').reduce((acc, k) => (acc == null ? acc : acc[k]), obj);
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    if (typeof window === 'undefined') return 'en';
    return localStorage.getItem('icp-lang') || 'en';
  });
  const [phase, setPhase] = useState('idle'); // 'idle' | 'fading-out' | 'fading-in'

  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem('icp-lang', lang); } catch (e) { /* ignore */ }
  }, [lang]);

  // Smooth transition: fade body out, swap lang, fade back in
  const setLang = useCallback((next) => {
    if (next === lang) return;
    setPhase('fading-out');
    document.body.classList.add('is-translating');
    window.setTimeout(() => {
      setLangState(next);
      setPhase('fading-in');
      window.setTimeout(() => {
        document.body.classList.remove('is-translating');
        setPhase('idle');
      }, 250);
    }, 200);
  }, [lang]);

  const toggleLang = useCallback(
    () => setLang(lang === 'en' ? 'fr' : 'en'),
    [lang, setLang]
  );

  const t = useCallback(
    (path, fallback) => {
      const val = getByPath(TRANSLATIONS[lang], path);
      if (val !== undefined && val !== null) return val;
      const enVal = getByPath(TRANSLATIONS.en, path);
      return SAFE(enVal, fallback ?? path);
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, phase }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Fallback in case provider is missing — useful for previews
    return { lang: 'en', t: (p, f) => SAFE(getByPath(TRANSLATIONS.en, p), f ?? p), toggleLang: () => {}, setLang: () => {}, phase: 'idle' };
  }
  return ctx;
};

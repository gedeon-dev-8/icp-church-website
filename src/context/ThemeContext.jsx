import { createContext, useContext, useState, useEffect } from 'react';
import { getLiturgicalSeason } from '../lib/liturgicalSeason';

const ThemeContext = createContext();

const SEASON_STORAGE_KEY = 'icp-season-override';

export function ThemeProvider({ children }) {
  // The theme is detected automatically, but users can override via localStorage.
  // Values: 'dark' (default) | 'light'
  // const [theme, setTheme] = useState(() => {
  //   return localStorage.getItem('icp-theme') || 'dark';
  // });

  // The theme is detected automatically, but users can override via localStorage.
  // Values: 'light'
  const [theme, setTheme] = useState('light');

  // The liturgical season is detected automatically, but admins (or
  // visitors who want to preview) can override via localStorage.
  // Values: 'auto' (default) | one of the season slugs.
  const [seasonOverride, setSeasonOverride] = useState(() => {
    if (typeof window === 'undefined') return 'auto';
    return localStorage.getItem(SEASON_STORAGE_KEY) || 'auto';
  });

  const detectedSeason = (typeof window === 'undefined')
    ? 'ordinary'
    : getLiturgicalSeason();
  const activeSeason = seasonOverride === 'auto' ? detectedSeason : seasonOverride;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('icp-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-season', activeSeason);
  }, [activeSeason]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (seasonOverride === 'auto') {
      localStorage.removeItem(SEASON_STORAGE_KEY);
    } else {
      localStorage.setItem(SEASON_STORAGE_KEY, seasonOverride);
    }
  }, [seasonOverride]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        season: activeSeason,
        detectedSeason,
        seasonOverride,
        setSeasonOverride,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

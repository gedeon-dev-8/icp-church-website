import { createContext, useContext, useState, useEffect } from 'react';
import { getLiturgicalSeason } from '../lib/liturgicalSeason';

const ThemeContext = createContext();

const SEASON_STORAGE_KEY = 'icp-season-override';
const THEME_STORAGE_KEY = 'icp-theme';

export function ThemeProvider({ children }) {
  // Always start in light mode by default.
  // The user's browser/system theme is intentionally ignored.
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';

    // If the user has previously selected a theme, restore it.
    // Otherwise, default to light mode.
    return localStorage.getItem(THEME_STORAGE_KEY) || 'light';
  });

  // The liturgical season is detected automatically, but admins (or
  // visitors who want to preview) can override via localStorage.
  // Values: 'auto' (default) | one of the season slugs.
  const [seasonOverride, setSeasonOverride] = useState(() => {
    if (typeof window === 'undefined') return 'auto';
    return localStorage.getItem(SEASON_STORAGE_KEY) || 'auto';
  });

  const detectedSeason =
    typeof window === 'undefined'
      ? 'ordinary'
      : getLiturgicalSeason();

  const activeSeason =
    seasonOverride === 'auto' ? detectedSeason : seasonOverride;

  // Apply the selected theme to the document.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  // Apply the active liturgical season.
  useEffect(() => {
    document.documentElement.setAttribute('data-season', activeSeason);
  }, [activeSeason]);

  // Persist the season override.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (seasonOverride === 'auto') {
      localStorage.removeItem(SEASON_STORAGE_KEY);
    } else {
      localStorage.setItem(SEASON_STORAGE_KEY, seasonOverride);
    }
  }, [seasonOverride]);

  // Toggle between light and dark mode.
  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === 'dark' ? 'light' : 'dark'
    );
  };

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
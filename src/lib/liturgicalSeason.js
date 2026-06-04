// ────────────────────────────────────────────────────────────────────
// Liturgical season detector (Western Christian calendar)
//
// Returns one of:
//   'advent'    | 'christmas' | 'epiphany' | 'lent'
//   'easter'    | 'pentecost' | 'ordinary'
//
// We compute Easter using the Anonymous Gregorian algorithm (Meeus /
// Jones / Butcher) and derive every moveable date from there. Fixed
// dates (Christmas, Epiphany) are calendar-locked. The seasons cascade
// in priority — e.g. Advent eats December until Christmas Eve.
//
// Used by ThemeContext to set <html data-season="…"> so SCSS can
// apply gentle palette shifts without ever breaking the base theme.
// ────────────────────────────────────────────────────────────────────

function easterSunday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3 = March, 4 = April
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

// First Sunday of Advent = the Sunday closest to St Andrew's Day (30 Nov).
// In practice: four Sundays before Christmas Day, inclusive of the
// fourth Sunday (so range Nov 27 – Dec 3).
function firstSundayOfAdvent(year) {
  const christmas = new Date(year, 11, 25);
  const dayOfWeek = christmas.getDay();           // 0 = Sun
  // Sunday on or before Christmas:
  const fourthAdvent = addDays(christmas, -dayOfWeek);
  return addDays(fourthAdvent, -21); // three weeks earlier
}

export function getLiturgicalSeason(now = new Date()) {
  const today = startOfDay(now);
  const year  = today.getFullYear();

  // Easter-anchored span for this calendar year
  const easter         = easterSunday(year);
  const ashWednesday   = addDays(easter, -46);
  const pentecost      = addDays(easter, 49);
  const easterSeasonEnd = pentecost; // Pentecost ends the Easter season

  // Christmas season: Dec 25 → Jan 5 (next year)
  // Epiphany season:  Jan 6 → day before Ash Wednesday
  // Advent:           1st Sunday of Advent → Dec 24
  const adventStart    = firstSundayOfAdvent(year);
  const christmasStart = new Date(year, 11, 25);
  const epiphanyStart  = new Date(year, 0, 6);

  // Build comparable timestamps once for fewer Date allocations.
  const t = today.getTime();

  if (t >= adventStart.getTime() && t < christmasStart.getTime())
    return 'advent';

  // Christmas wraps the year boundary — Dec 25 (this year) → Jan 5 (next)
  if (t >= christmasStart.getTime()) return 'christmas';

  // We're now in Jan/Feb/Mar/etc of the current year.
  // Christmas continued from Dec 25 of previous year through Jan 5.
  const prevChristmasStart = new Date(year - 1, 11, 25);
  const christmasEndThisJan = new Date(year, 0, 5);
  if (t >= prevChristmasStart.getTime() && t <= christmasEndThisJan.getTime())
    return 'christmas';

  // Epiphany season: Jan 6 → day before Ash Wednesday
  if (t >= epiphanyStart.getTime() && t < ashWednesday.getTime())
    return 'epiphany';

  // Lent: Ash Wednesday → Easter Saturday (day before Easter Sunday)
  if (t >= ashWednesday.getTime() && t < easter.getTime())
    return 'lent';

  // Easter season: Easter Sunday → Pentecost (exclusive end)
  if (t >= easter.getTime() && t < pentecost.getTime())
    return 'easter';

  // Pentecost day itself
  if (t === pentecost.getTime()) return 'pentecost';

  // Everything else is Ordinary Time
  return 'ordinary';
}

// Human-readable label, mostly for analytics/debugging.
export function getSeasonLabel(season) {
  return {
    advent:    'Advent',
    christmas: 'Christmas',
    epiphany:  'Epiphany',
    lent:      'Lent',
    easter:    'Easter',
    pentecost: 'Pentecost',
    ordinary:  'Ordinary Time',
  }[season] || 'Ordinary Time';
}

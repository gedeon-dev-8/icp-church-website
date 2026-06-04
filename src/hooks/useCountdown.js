import { useEffect, useState } from 'react';

// ────────────────────────────────────────────────────────────────────
// All Sunday-service times are anchored to the church's local timezone
// — Africa/Johannesburg (UTC+2, no DST). That way a visitor in London,
// Lagos, or Lima still sees the correct countdown to 09:00 Pretoria
// time, not 09:00 wherever they happen to be standing.
// ────────────────────────────────────────────────────────────────────
export const CHURCH_TZ = 'Africa/Johannesburg';
export const SUNDAY_SERVICE_HOUR = 9; // 09:00 local Pretoria time

/**
 * Returns a live countdown to the given target date.
 * Updates every minute (cheaper than every second, sufficient for service times).
 *
 * Returns: { days, hours, minutes, totalMs, isLive, isStartingSoon }
 *  - isLive          → target is within ±2h
 *  - isStartingSoon  → target is in the next 60 minutes
 */
export function useCountdown(target) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const totalMs = (target instanceof Date ? target.getTime() : target) - now;
  const totalMinutes = Math.max(0, Math.floor(totalMs / 60_000));

  const days    = Math.floor(totalMinutes / (60 * 24));
  const hours   = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  const isStartingSoon = totalMs > 0 && totalMs < 60 * 60 * 1000;
  const isLive = Math.abs(totalMs) < 2 * 60 * 60 * 1000 && totalMs <= 0;

  return { days, hours, minutes, totalMs, isLive, isStartingSoon };
}

// ────────────────────────────────────────────────────────────────────
// Timezone helpers
//
// JavaScript's Date object is fundamentally tied to the runtime's
// local timezone — there's no built-in way to construct "9 AM in
// Africa/Johannesburg" directly. We work around that with two helper
// functions that round-trip through Intl.DateTimeFormat:
//
//   - getPartsInTz(date, tz)    → what wall-clock parts that instant
//                                 reads as in the given timezone.
//   - dateFromTzParts({...}, tz) → the UTC Date whose wall-clock in
//                                 the given timezone matches the
//                                 parts you supplied.
//
// These let us build "next Sunday at 09:00 Pretoria time" no matter
// where the visitor happens to be running their browser.
// ────────────────────────────────────────────────────────────────────

function getPartsInTz(date, tz) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    weekday: 'short',
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(date).map(p => [p.type, p.value])
  );
  const WEEKDAY_INDEX = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return {
    year:    Number(parts.year),
    month:   Number(parts.month),
    day:     Number(parts.day),
    hour:    Number(parts.hour === '24' ? '00' : parts.hour),
    minute:  Number(parts.minute),
    second:  Number(parts.second),
    weekday: WEEKDAY_INDEX[parts.weekday] ?? 0,
  };
}

// Given wall-clock parts (year/month/day/hour/minute) in `tz`, return
// the corresponding absolute UTC Date. We solve for the UTC offset
// by checking what that timezone says about a guessed UTC instant and
// correcting.
function dateFromTzParts({ year, month, day, hour, minute = 0 }, tz) {
  // First guess: treat the parts as UTC.
  const guess = Date.UTC(year, month - 1, day, hour, minute, 0);
  // What does that UTC instant read as in `tz`?
  const probed = getPartsInTz(new Date(guess), tz);
  // Difference (in minutes) between what we wanted and what we got.
  const wantedMs = Date.UTC(year, month - 1, day, hour, minute, 0);
  const gotMs = Date.UTC(
    probed.year, probed.month - 1, probed.day,
    probed.hour, probed.minute, probed.second
  );
  // Correct the guess by that diff.
  return new Date(guess + (wantedMs - gotMs));
}

/**
 * Compute the next Sunday at 09:00 in Africa/Johannesburg time.
 *
 * Always returns a Date whose underlying timestamp matches the
 * actual moment the service begins in Pretoria — regardless of the
 * visitor's local timezone. The countdown will therefore reflect
 * the true wait, not a local-clock approximation.
 */
export function getNextSundayService(from = new Date()) {
  // What day/time is it in Pretoria right now?
  const here = getPartsInTz(from, CHURCH_TZ);

  // If it's Sunday and we're still before service hour, target today.
  let daysUntilSunday;
  if (here.weekday === 0 && here.hour < SUNDAY_SERVICE_HOUR) {
    daysUntilSunday = 0;
  } else {
    daysUntilSunday = (7 - here.weekday) % 7 || 7;
  }

  // Build the target wall-clock date in Pretoria, then convert to UTC.
  const targetDay = new Date(Date.UTC(here.year, here.month - 1, here.day));
  targetDay.setUTCDate(targetDay.getUTCDate() + daysUntilSunday);

  return dateFromTzParts(
    {
      year:   targetDay.getUTCFullYear(),
      month:  targetDay.getUTCMonth() + 1,
      day:    targetDay.getUTCDate(),
      hour:   SUNDAY_SERVICE_HOUR,
      minute: 0,
    },
    CHURCH_TZ,
  );
}

/**
 * React hook variant — returns the next Sunday service Date and
 * automatically recomputes when the local day flips, so a tab left
 * open through a service rolls forward to next week without a reload.
 */
export function useNextSundayService() {
  const [target, setTarget] = useState(() => getNextSundayService());

  useEffect(() => {
    // Check once a minute; if we've crossed past the target, advance.
    const id = setInterval(() => {
      setTarget(prev => {
        if (Date.now() > prev.getTime() + 2 * 60 * 60 * 1000) {
          // More than 2h past the last target → roll forward.
          return getNextSundayService();
        }
        // Also handle the case where the user's local day has changed
        // (e.g. crossed midnight): recompute defensively. Cheap call.
        const fresh = getNextSundayService();
        if (fresh.getTime() !== prev.getTime()) return fresh;
        return prev;
      });
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  return target;
}

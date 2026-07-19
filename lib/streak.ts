export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null; // "YYYY-MM-DD" in local time
}

const STORAGE_KEY = "typemor_streak";

function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function daysBetween(dateStrA: string, dateStrB: string): number {
  const a = new Date(dateStrA + "T00:00:00");
  const b = new Date(dateStrB + "T00:00:00");
  const diffMs = b.getTime() - a.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function loadStreak(): StreakState {
  if (typeof window === "undefined") {
    return { currentStreak: 0, longestStreak: 0, lastActiveDate: null };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { currentStreak: 0, longestStreak: 0, lastActiveDate: null };
    return JSON.parse(raw) as StreakState;
  } catch {
    return { currentStreak: 0, longestStreak: 0, lastActiveDate: null };
  }
}

function saveStreak(state: StreakState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Call this whenever the user completes an activity (typing session, essay, etc).
// Returns the updated streak state.
export function recordActivity(): StreakState {
  const today = getLocalDateString();
  const prev = loadStreak();

  if (prev.lastActiveDate === today) {
    // Already recorded today, nothing changes.
    return prev;
  }

  let newStreak: number;
  if (prev.lastActiveDate === null) {
    newStreak = 1;
  } else {
    const diff = daysBetween(prev.lastActiveDate, today);
    if (diff === 1) {
      newStreak = prev.currentStreak + 1;
    } else {
      newStreak = 1; // streak broken, restart
    }
  }

  const next: StreakState = {
    currentStreak: newStreak,
    longestStreak: Math.max(prev.longestStreak, newStreak),
    lastActiveDate: today,
  };

  saveStreak(next);
  return next;
}

// Call this on page load to check if the streak should visually show as "at risk" or already broken,
// without recording a new activity.
export function getCurrentStreakDisplay(): StreakState {
  const today = getLocalDateString();
  const state = loadStreak();

  if (state.lastActiveDate === null) return state;

  const diff = daysBetween(state.lastActiveDate, today);
  if (diff > 1) {
    // Streak broken by inactivity — reflect that visually, but don't persist
    // until the user is actually active again.
    return { ...state, currentStreak: 0 };
  }

  return state;
}
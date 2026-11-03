import { asObject, createLocalStore, getLocalDateString } from "@/lib/store";

export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null; // "YYYY-MM-DD" in local time
}

const EMPTY_STREAK: StreakState = { currentStreak: 0, longestStreak: 0, lastActiveDate: null };

export const streakStore = createLocalStore<StreakState>("typemor_streak", EMPTY_STREAK, (raw) => ({
  ...EMPTY_STREAK,
  ...asObject<StreakState>(raw),
}));

function daysBetween(dateStrA: string, dateStrB: string): number {
  const a = new Date(dateStrA + "T00:00:00");
  const b = new Date(dateStrB + "T00:00:00");
  const diffMs = b.getTime() - a.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

// Call this whenever the user completes an activity (typing session, essay, etc).
export function recordActivity() {
  const today = getLocalDateString();
  streakStore.set((prev) => {
    if (prev.lastActiveDate === today) {
      // Already recorded today, nothing changes.
      return prev;
    }

    const continues =
      prev.lastActiveDate !== null && daysBetween(prev.lastActiveDate, today) === 1;
    const newStreak = continues ? prev.currentStreak + 1 : 1;

    return {
      currentStreak: newStreak,
      longestStreak: Math.max(prev.longestStreak, newStreak),
      lastActiveDate: today,
    };
  });
}

// Shows the streak as broken (0) if the user missed a day, without persisting
// that until the user is actually active again.
export function getStreakDisplay(state: StreakState, today: string = getLocalDateString()): StreakState {
  if (state.lastActiveDate === null) return state;
  if (daysBetween(state.lastActiveDate, today) > 1) {
    return { ...state, currentStreak: 0 };
  }
  return state;
}

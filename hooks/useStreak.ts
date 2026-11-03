"use client";

import { useMemo } from "react";
import { useHydrated, useLocalStore } from "@/lib/store";
import { streakStore, recordActivity, getStreakDisplay } from "@/lib/streak";

export function useStreak() {
  const stored = useLocalStore(streakStore);
  const loaded = useHydrated();
  const streak = useMemo(() => getStreakDisplay(stored), [stored]);

  return { streak, markActive: recordActivity, loaded };
}

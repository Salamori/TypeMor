"use client";

import { useState, useEffect, useCallback } from "react";
import {
  StreakState,
  loadStreak,
  recordActivity,
  getCurrentStreakDisplay,
} from "@/lib/streak";

export function useStreak() {
  const [streak, setStreak] = useState<StreakState>({
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setStreak(getCurrentStreakDisplay());
    setLoaded(true);
  }, []);

  const markActive = useCallback(() => {
    const updated = recordActivity();
    setStreak(updated);
  }, []);

  return { streak, markActive, loaded };
}
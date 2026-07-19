"use client";

import { useStreak } from "@/hooks/useStreak";

export function StreakCard() {
  const { streak, loaded } = useStreak();

  if (!loaded) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800">
      <span className="text-xl">🔥</span>
      <span className="text-lg font-semibold text-white">{streak.currentStreak}</span>
      <span className="text-sm text-zinc-500">
        day{streak.currentStreak === 1 ? "" : "s"}
      </span>
    </div>
  );
}
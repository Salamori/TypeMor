"use client";

import { useMemo } from "react";
import { useVocabulary } from "@/hooks/useVocabulary";
import { ACHIEVEMENTS, getUnlockedAchievements, AchievementStats } from "@/lib/achievements";

export function useAchievements() {
  const { words, stats, loaded } = useVocabulary();

  const achievementStats: AchievementStats = useMemo(() => {
    const wordList = Object.values(words);
    return {
      textsCompleted: stats.textsCompleted,
      bestWpm: stats.bestWpm,
      bestAccuracy: stats.bestAccuracy,
      perfectRuns: stats.perfectRuns,
      wordsMarked: wordList.length,
      wordsMastered: wordList.filter((w) => w.mastered).length,
    };
  }, [words, stats]);

  const unlocked = useMemo(
    () => getUnlockedAchievements(achievementStats),
    [achievementStats]
  );

  const unlockedIds = new Set(unlocked.map((a) => a.id));

  return {
    all: ACHIEVEMENTS,
    unlocked,
    unlockedIds,
    stats: achievementStats,
    loaded,
  };
}

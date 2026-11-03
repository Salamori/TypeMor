"use client";

import { useMemo } from "react";
import { useHydrated, useLocalStore } from "@/lib/store";
import {
  QuestSettings,
  incrementQuestProgress,
  questSettingsStore,
  questStateStore,
  resolveTodaysQuests,
} from "@/lib/dailyQuests";

function updateSettings(newSettings: QuestSettings) {
  questSettingsStore.set(newSettings);
}

export function useDailyQuests() {
  const stored = useLocalStore(questStateStore);
  const settings = useLocalStore(questSettingsStore);
  const loaded = useHydrated();

  const state = useMemo(() => resolveTodaysQuests(stored, settings), [stored, settings]);

  const allComplete =
    state.quests.length > 0 && state.quests.every((q) => q.progress >= q.target);

  return {
    state,
    settings,
    progressQuest: incrementQuestProgress,
    updateSettings,
    allComplete,
    loaded,
  };
}

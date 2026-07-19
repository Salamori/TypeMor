"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DailyQuestState,
  QuestType,
  QuestSettings,
  getTodaysQuests,
  incrementQuestProgress,
  loadQuestSettings,
  saveQuestSettings,
} from "@/lib/dailyQuests";

export function useDailyQuests() {
  const [state, setState] = useState<DailyQuestState>({ date: "", quests: [] });
  const [settings, setSettings] = useState<QuestSettings>({
    enabledTypes: [],
    targets: { type_texts: 3, write_essay: 1, master_words: 2, mark_words: 3 },
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setState(getTodaysQuests());
    setSettings(loadQuestSettings());
    setLoaded(true);
  }, []);

  const progressQuest = useCallback((type: QuestType, amount: number = 1) => {
    const updated = incrementQuestProgress(type, amount);
    setState(updated);
  }, []);

  const updateSettings = useCallback((newSettings: QuestSettings) => {
    saveQuestSettings(newSettings);
    setSettings(newSettings);
    setState(getTodaysQuests());
  }, []);

  const allComplete =
    state.quests.length > 0 && state.quests.every((q) => q.progress >= q.target);

  return { state, settings, progressQuest, updateSettings, allComplete, loaded };
}
import { asObject, createLocalStore, getLocalDateString } from "@/lib/store";

export type QuestType = "type_texts" | "write_essay" | "master_words" | "mark_words";

export interface QuestDefinition {
  type: QuestType;
  label: (target: number) => string;
  defaultTarget: number;
  icon: string;
}

export const QUEST_DEFINITIONS: QuestDefinition[] = [
  {
    type: "type_texts",
    label: (n) => `Type ${n} text${n === 1 ? "" : "s"}`,
    defaultTarget: 3,
    icon: "⌨️",
  },
  {
    type: "write_essay",
    label: (n) => `Write ${n} essay${n === 1 ? "" : "s"}`,
    defaultTarget: 1,
    icon: "✍️",
  },
  {
    type: "master_words",
    label: (n) => `Master ${n} word${n === 1 ? "" : "s"}`,
    defaultTarget: 2,
    icon: "🎯",
  },
  {
    type: "mark_words",
    label: (n) => `Learn ${n} new word${n === 1 ? "" : "s"}`,
    defaultTarget: 3,
    icon: "📖",
  },
];

export interface QuestProgress {
  type: QuestType;
  target: number;
  progress: number;
}

export interface DailyQuestState {
  date: string; // "YYYY-MM-DD"
  quests: QuestProgress[];
}

export interface QuestSettings {
  enabledTypes: QuestType[];
  targets: Record<QuestType, number>;
}

const DEFAULT_SETTINGS: QuestSettings = {
  enabledTypes: ["type_texts", "write_essay", "master_words", "mark_words"],
  targets: {
    type_texts: 3,
    write_essay: 1,
    master_words: 2,
    mark_words: 3,
  },
};

export const questSettingsStore = createLocalStore<QuestSettings>(
  "typemor_quest_settings",
  DEFAULT_SETTINGS,
  (raw) => {
    const parsed = asObject<QuestSettings>(raw);
    return {
      enabledTypes: parsed.enabledTypes ?? DEFAULT_SETTINGS.enabledTypes,
      targets: { ...DEFAULT_SETTINGS.targets, ...parsed.targets },
    };
  }
);

export const questStateStore = createLocalStore<DailyQuestState | null>(
  "typemor_daily_quests",
  null,
  (raw) => {
    const parsed = asObject<DailyQuestState>(raw);
    return typeof parsed.date === "string" && Array.isArray(parsed.quests)
      ? (parsed as DailyQuestState)
      : null;
  }
);

function freshQuests(date: string, settings: QuestSettings): DailyQuestState {
  return {
    date,
    quests: settings.enabledTypes.map((type) => ({
      type,
      target: settings.targets[type],
      progress: 0,
    })),
  };
}

// Today's quests: the stored state if it is from today, otherwise a fresh,
// zeroed set based on the current settings.
export function resolveTodaysQuests(
  stored: DailyQuestState | null,
  settings: QuestSettings,
  today: string = getLocalDateString()
): DailyQuestState {
  if (stored && stored.date === today) return stored;
  return freshQuests(today, settings);
}

export function incrementQuestProgress(type: QuestType, amount: number = 1) {
  questStateStore.set((prev) => {
    const state = resolveTodaysQuests(prev, questSettingsStore.get());
    return {
      ...state,
      quests: state.quests.map((q) =>
        q.type === type ? { ...q, progress: Math.min(q.progress + amount, q.target) } : q
      ),
    };
  });
}

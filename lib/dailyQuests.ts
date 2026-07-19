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

const STATE_KEY = "typemor_daily_quests";
const SETTINGS_KEY = "typemor_quest_settings";

function getLocalDateString(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function loadQuestSettings(): QuestSettings {
  const defaults: QuestSettings = {
    enabledTypes: ["type_texts", "write_essay", "master_words"],
    targets: {
      type_texts: 3,
      write_essay: 1,
      master_words: 2,
      mark_words: 3,
    },
  };
  if (typeof window === "undefined") return defaults;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return defaults;
  }
}

export function saveQuestSettings(settings: QuestSettings) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function loadRawState(): DailyQuestState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DailyQuestState;
  } catch {
    return null;
  }
}

function saveRawState(state: DailyQuestState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

// Returns today's quest state, regenerating it (fresh, zeroed progress)
// if the stored state is from a previous day, based on current settings.
export function getTodaysQuests(): DailyQuestState {
  const today = getLocalDateString();
  const existing = loadRawState();
  const settings = loadQuestSettings();

  if (existing && existing.date === today) {
    return existing;
  }

  const fresh: DailyQuestState = {
    date: today,
    quests: settings.enabledTypes.map((type) => ({
      type,
      target: settings.targets[type],
      progress: 0,
    })),
  };
  saveRawState(fresh);
  return fresh;
}

export function incrementQuestProgress(type: QuestType, amount: number = 1): DailyQuestState {
  const state = getTodaysQuests();
  const updated: DailyQuestState = {
    ...state,
    quests: state.quests.map((q) =>
      q.type === type ? { ...q, progress: Math.min(q.progress + amount, q.target) } : q
    ),
  };
  saveRawState(updated);
  return updated;
}
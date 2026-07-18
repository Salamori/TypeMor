export interface VocabWord {
  word: string;
  addedAt: number;
  correctStreak: number;
  mastered: boolean;
}

export interface VocabState {
  words: Record<string, VocabWord>;
  points: number;
}

const STORAGE_KEY = "typemor_vocabulary";

export function loadVocabState(): VocabState {
  if (typeof window === "undefined") return { words: {}, points: 0 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { words: {}, points: 0 };
    return JSON.parse(raw) as VocabState;
  } catch {
    return { words: {}, points: 0 };
  }
}

export function saveVocabState(state: VocabState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function normalizeWord(word: string): string {
  return word.toLowerCase().replace(/[^a-z']/g, "");
}

export const POINTS = {
  MARK_NEW: 5,
  CORRECT_RETYPE: 10,
  MASTERED: 25,
};

export const MASTERY_STREAK = 3;

export interface Rank {
  name: string;
  minPoints: number;
  theme: string;
}

export const RANKS: Rank[] = [
  { name: "Beginner", minPoints: 0, theme: "default" },
  { name: "Apprentice", minPoints: 50, theme: "ocean" },
  { name: "Skilled", minPoints: 150, theme: "sunset" },
  { name: "Expert", minPoints: 350, theme: "neon" },
  { name: "Master", minPoints: 700, theme: "royal" },
  { name: "Legend", minPoints: 1500, theme: "aurora" },
];

export function getRankForPoints(points: number): Rank {
  let current = RANKS[0];
  for (const rank of RANKS) {
    if (points >= rank.minPoints) current = rank;
  }
  return current;
}

export function getNextRank(points: number): Rank | null {
  for (const rank of RANKS) {
    if (points < rank.minPoints) return rank;
  }
  return null;
}
export interface VocabWord {
  word: string;
  addedAt: number;
  correctStreak: number;
  mastered: boolean;
}

export interface Stats {
  textsCompleted: number;
  bestWpm: number;
  bestAccuracy: number;
  perfectRuns: number;
}

export interface VocabState {
  words: Record<string, VocabWord>;
  points: number;
  stats: Stats;
}

const STORAGE_KEY = "typemor_vocabulary";

const EMPTY_STATE: VocabState = {
  words: {},
  points: 0,
  stats: { textsCompleted: 0, bestWpm: 0, bestAccuracy: 0, perfectRuns: 0 },
};

export function loadVocabState(): VocabState {
  if (typeof window === "undefined") return EMPTY_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw) as Partial<VocabState>;
    return {
      words: parsed.words ?? {},
      points: parsed.points ?? 0,
      stats: parsed.stats ?? EMPTY_STATE.stats,
    };
  } catch {
    return EMPTY_STATE;
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
export interface WordCheckResult {
  word: string;
  correct: boolean;
}

export function checkWordsInText(
  text: string,
  charStatuses: ("pending" | "correct" | "incorrect")[]
): WordCheckResult[] {
  const results: WordCheckResult[] = [];
  let current = "";
  let currentCorrect = true;
  let hasChars = false;

  for (let i = 0; i <= text.length; i++) {
    const ch = text[i];
    const isBoundary = ch === undefined || ch === " ";

    if (isBoundary) {
      if (hasChars) {
        results.push({ word: normalizeWord(current), correct: currentCorrect });
      }
      current = "";
      currentCorrect = true;
      hasChars = false;
    } else {
      current += ch;
      hasChars = true;
      if (charStatuses[i] === "incorrect") {
        currentCorrect = false;
      }
    }
  }

  return results;
}
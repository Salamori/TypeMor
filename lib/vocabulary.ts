import { asObject, createLocalStore } from "@/lib/store";

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

const EMPTY_STATE: VocabState = {
  words: {},
  points: 0,
  stats: { textsCompleted: 0, bestWpm: 0, bestAccuracy: 0, perfectRuns: 0 },
};

export const vocabStore = createLocalStore<VocabState>("typemor_vocabulary", EMPTY_STATE, (raw) => {
  const parsed = asObject<VocabState>(raw);
  return {
    words: parsed.words ?? {},
    points: parsed.points ?? 0,
    stats: { ...EMPTY_STATE.stats, ...parsed.stats },
  };
});

export function normalizeWord(word: string): string {
  return word.toLowerCase().replace(/[^a-z']/g, "");
}

export const POINTS = {
  MARK_NEW: 5,
  CORRECT_RETYPE: 10,
  MASTERED: 25,
};

export const MASTERY_STREAK = 3;

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
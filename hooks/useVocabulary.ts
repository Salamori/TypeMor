"use client";

import { useCallback } from "react";
import { useHydrated, useLocalStore } from "@/lib/store";
import { vocabStore, normalizeWord, POINTS, MASTERY_STREAK } from "@/lib/vocabulary";

// Returns true if the word was newly added.
function markWord(rawWord: string): boolean {
  const word = normalizeWord(rawWord);
  if (!word || vocabStore.get().words[word]) return false;

  vocabStore.set((prev) => ({
    ...prev,
    words: {
      ...prev.words,
      [word]: { word, addedAt: Date.now(), correctStreak: 0, mastered: false },
    },
    points: prev.points + POINTS.MARK_NEW,
  }));
  return true;
}

function unmarkWord(rawWord: string) {
  const word = normalizeWord(rawWord);
  vocabStore.set((prev) => {
    if (!prev.words[word]) return prev;
    const next = { ...prev.words };
    delete next[word];
    // Take back the "mark new" bonus so mark/unmark can't be farmed for points.
    return { ...prev, words: next, points: Math.max(0, prev.points - POINTS.MARK_NEW) };
  });
}

// Returns true if this retype made the word mastered.
function recordCorrectRetype(rawWord: string): boolean {
  const word = normalizeWord(rawWord);
  const existing = vocabStore.get().words[word];
  if (!existing || existing.mastered) return false;

  const newStreak = existing.correctStreak + 1;
  const justMastered = newStreak >= MASTERY_STREAK;

  vocabStore.set((prev) => ({
    ...prev,
    words: {
      ...prev.words,
      [word]: { ...existing, correctStreak: newStreak, mastered: justMastered },
    },
    points: prev.points + POINTS.CORRECT_RETYPE + (justMastered ? POINTS.MASTERED : 0),
  }));
  return justMastered;
}

function recordSessionResult(wpm: number, accuracy: number, countsForRecords: boolean = true) {
  vocabStore.set((prev) => ({
    ...prev,
    stats: {
      textsCompleted: prev.stats.textsCompleted + 1,
      bestWpm: countsForRecords ? Math.max(prev.stats.bestWpm, wpm) : prev.stats.bestWpm,
      bestAccuracy: countsForRecords
        ? Math.max(prev.stats.bestAccuracy, accuracy)
        : prev.stats.bestAccuracy,
      perfectRuns: prev.stats.perfectRuns + (countsForRecords && accuracy === 100 ? 1 : 0),
    },
  }));
}

export function useVocabulary() {
  const state = useLocalStore(vocabStore);
  const loaded = useHydrated();

  const isMarked = useCallback(
    (rawWord: string) => Boolean(state.words[normalizeWord(rawWord)]),
    [state.words]
  );

  return {
    words: state.words,
    points: state.points,
    stats: state.stats,
    markWord,
    unmarkWord,
    recordCorrectRetype,
    recordSessionResult,
    isMarked,
    loaded,
  };
}

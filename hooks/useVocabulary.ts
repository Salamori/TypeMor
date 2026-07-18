"use client";

import { useState, useEffect, useCallback } from "react";
import {
  VocabState,
  loadVocabState,
  saveVocabState,
  normalizeWord,
  POINTS,
  MASTERY_STREAK,
  getRankForPoints,
} from "@/lib/vocabulary";

export function useVocabulary() {
  const [state, setState] = useState<VocabState>({ words: {}, points: 0 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setState(loadVocabState());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveVocabState(state);
  }, [state, loaded]);

  const markWord = useCallback((rawWord: string) => {
    const word = normalizeWord(rawWord);
    if (!word) return;

    setState((prev) => {
      if (prev.words[word]) return prev;
      return {
        words: {
          ...prev.words,
          [word]: { word, addedAt: Date.now(), correctStreak: 0, mastered: false },
        },
        points: prev.points + POINTS.MARK_NEW,
      };
    });
  }, []);

  const unmarkWord = useCallback((rawWord: string) => {
    const word = normalizeWord(rawWord);
    setState((prev) => {
      const next = { ...prev.words };
      delete next[word];
      return { ...prev, words: next };
    });
  }, []);

  const recordCorrectRetype = useCallback((rawWord: string) => {
    const word = normalizeWord(rawWord);
    setState((prev) => {
      const existing = prev.words[word];
      if (!existing || existing.mastered) return prev;

      const newStreak = existing.correctStreak + 1;
      const justMastered = newStreak >= MASTERY_STREAK;

      return {
        words: {
          ...prev.words,
          [word]: { ...existing, correctStreak: newStreak, mastered: justMastered },
        },
        points:
          prev.points +
          POINTS.CORRECT_RETYPE +
          (justMastered ? POINTS.MASTERED : 0),
      };
    });
  }, []);

  const isMarked = useCallback(
    (rawWord: string) => Boolean(state.words[normalizeWord(rawWord)]),
    [state.words]
  );

  const rank = getRankForPoints(state.points);

  return {
    words: state.words,
    points: state.points,
    rank,
    markWord,
    unmarkWord,
    recordCorrectRetype,
    isMarked,
    loaded,
  };
}
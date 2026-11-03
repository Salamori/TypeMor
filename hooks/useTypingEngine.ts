"use client";

import { useReducer, useCallback, useEffect, useState } from "react";

export type CharStatus = "pending" | "correct" | "incorrect";

export interface CharState {
  char: string;
  status: CharStatus;
}

export interface TypingStats {
  wpm: number;
  accuracy: number;
  elapsedSeconds: number;
  correctChars: number;
  incorrectChars: number;
  totalTyped: number;
}

interface UseTypingEngineReturn {
  text: string;
  chars: CharState[];
  cursorIndex: number;
  stats: TypingStats;
  isFinished: boolean;
  isStarted: boolean;
  handleKeyInput: (key: string) => void;
  reset: (newText?: string) => void;
}

interface EngineState {
  text: string;
  chars: CharState[];
  cursorIndex: number;
  startTime: number | null;
  endTime: number | null;
  incorrectCount: number;
  totalTyped: number;
}

type EngineAction =
  | { type: "key"; key: string; now: number }
  | { type: "reset"; text?: string };

function initState(text: string): EngineState {
  return {
    text,
    chars: text.split("").map((char) => ({ char, status: "pending" as CharStatus })),
    cursorIndex: 0,
    startTime: null,
    endTime: null,
    incorrectCount: 0,
    totalTyped: 0,
  };
}

// A reducer (instead of separate useState calls) so that several keys arriving
// in one event — e.g. mobile autocomplete or paste — each see the latest cursor.
function reducer(state: EngineState, action: EngineAction): EngineState {
  if (action.type === "reset") return initState(action.text ?? state.text);

  if (state.endTime !== null) return state;
  const { key, now } = action;

  if (key === "Backspace") {
    if (state.cursorIndex === 0) return state;
    const chars = [...state.chars];
    chars[state.cursorIndex - 1] = { ...chars[state.cursorIndex - 1], status: "pending" };
    return { ...state, chars, cursorIndex: state.cursorIndex - 1 };
  }

  if (key.length !== 1 || state.cursorIndex >= state.chars.length) return state;

  const chars = [...state.chars];
  const target = chars[state.cursorIndex];
  const correct = target.char === key;
  chars[state.cursorIndex] = { ...target, status: correct ? "correct" : "incorrect" };
  const cursorIndex = state.cursorIndex + 1;

  return {
    ...state,
    chars,
    cursorIndex,
    startTime: state.startTime ?? now,
    endTime: cursorIndex === chars.length ? now : null,
    incorrectCount: state.incorrectCount + (correct ? 0 : 1),
    totalTyped: state.totalTyped + 1,
  };
}

export function useTypingEngine(initialText: string): UseTypingEngineReturn {
  const [state, dispatch] = useReducer(reducer, initialText, initState);
  const [now, setNow] = useState(0);

  const { text, chars, cursorIndex, startTime, endTime, incorrectCount, totalTyped } = state;
  const isStarted = startTime !== null;
  const isFinished = endTime !== null;

  useEffect(() => {
    if (!isStarted || isFinished) return;
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, [isStarted, isFinished]);

  const reset = useCallback((newText?: string) => dispatch({ type: "reset", text: newText }), []);

  const handleKeyInput = useCallback(
    (key: string) => dispatch({ type: "key", key, now: Date.now() }),
    []
  );

  const durationSeconds =
    startTime === null ? 0 : Math.max(0, ((endTime ?? now) - startTime) / 1000);

  const correctChars = chars.filter((c) => c.status === "correct").length;
  const minutes = Math.max(durationSeconds / 60, 1 / 6000);
  const rawWpm = Math.round(correctChars / 5 / minutes);
  const accuracy = totalTyped > 0 ? Math.round(((totalTyped - incorrectCount) / totalTyped) * 100) : 100;

  const stats: TypingStats = {
    wpm: Number.isFinite(rawWpm) && isStarted ? rawWpm : 0,
    accuracy,
    elapsedSeconds: Math.floor(durationSeconds),
    correctChars,
    incorrectChars: incorrectCount,
    totalTyped,
  };

  return { text, chars, cursorIndex, stats, isFinished, isStarted, handleKeyInput, reset };
}

"use client";

import { useState, useCallback, useRef, useEffect } from "react";

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
  chars: CharState[];
  cursorIndex: number;
  stats: TypingStats;
  isFinished: boolean;
  isStarted: boolean;
  handleKeyInput: (key: string) => void;
  reset: (newText?: string) => void;
}

export function useTypingEngine(initialText: string): UseTypingEngineReturn {
  const [text, setText] = useState(initialText);
  const [chars, setChars] = useState<CharState[]>(() =>
    initialText.split("").map((char) => ({ char, status: "pending" as CharStatus }))
  );
  const [cursorIndex, setCursorIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [totalTyped, setTotalTyped] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isStarted = startTime !== null;
  const isFinished = endTime !== null;

  useEffect(() => {
    if (isStarted && !isFinished) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - (startTime as number)) / 1000));
      }, 200);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isStarted, isFinished, startTime]);

  const reset = useCallback(
    (newText?: string) => {
      const nextText = newText ?? text;
      setText(nextText);
      setChars(nextText.split("").map((char) => ({ char, status: "pending" as CharStatus })));
      setCursorIndex(0);
      setStartTime(null);
      setEndTime(null);
      setElapsedSeconds(0);
      setIncorrectCount(0);
      setTotalTyped(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
    },
    [text]
  );

  const handleKeyInput = useCallback(
    (key: string) => {
      if (isFinished) return;

      if (key === "Backspace") {
        if (cursorIndex === 0) return;
        setChars((prev) => {
          const next = [...prev];
          next[cursorIndex - 1] = { ...next[cursorIndex - 1], status: "pending" };
          return next;
        });
        setCursorIndex((i) => i - 1);
        return;
      }

      if (key.length !== 1) return;

      if (!isStarted) {
        setStartTime(Date.now());
      }

      setChars((prev) => {
        const next = [...prev];
        const target = next[cursorIndex];
        const correct = target.char === key;
        next[cursorIndex] = { ...target, status: correct ? "correct" : "incorrect" };
        if (!correct) setIncorrectCount((c) => c + 1);
        return next;
      });

      setTotalTyped((t) => t + 1);

      const nextIndex = cursorIndex + 1;
      setCursorIndex(nextIndex);

      if (nextIndex === text.length) {
        setEndTime(Date.now());
      }
    },
    [cursorIndex, isFinished, isStarted, text.length]
  );

  const durationSeconds =
    isFinished && startTime && endTime ? (endTime - startTime) / 1000 : elapsedSeconds;

  const correctChars = chars.filter((c) => c.status === "correct").length;
  const minutes = Math.max(durationSeconds / 60, 1 / 6000);
  const rawWpm = Math.round(correctChars / 5 / minutes);
  const accuracy = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 100;

  const stats: TypingStats = {
    wpm: Number.isFinite(rawWpm) && isStarted ? rawWpm : 0,
    accuracy,
    elapsedSeconds: Math.floor(durationSeconds),
    correctChars,
    incorrectChars: incorrectCount,
    totalTyped,
  };

  return { chars, cursorIndex, stats, isFinished, isStarted, handleKeyInput, reset };
}
"use client";

import { useState, useEffect } from "react";
import { useTypingEngine } from "@/hooks/useTypingEngine";
import { useVocabulary } from "@/hooks/useVocabulary";
import { TypingArea } from "@/components/TypingArea";
import { StatsBar } from "@/components/StatsBar";
import { TextSelector } from "@/components/TextSelector";
import { WordReview } from "@/components/WordReview";
import { SAMPLE_TEXTS } from "@/lib/sample-texts";
import { generateWords } from "@/lib/word-pool";
import Link from "next/link";

export default function Home() {
  const [text, setText] = useState(SAMPLE_TEXTS[0]);
  const [mode, setMode] = useState<"words" | "custom">("words");
  const [wordCount, setWordCount] = useState(25);
  const { chars, cursorIndex, stats, isFinished, handleKeyInput, reset } =
    useTypingEngine(text);
  const { points, rank, isMarked, markWord, unmarkWord, recordSessionResult } = useVocabulary();

  useEffect(() => {
    const initial = generateWords(25);
    setText(initial);
    reset(initial);
  }, []);
  useEffect(() => {
    if (isFinished) {
      recordSessionResult(stats.wpm, stats.accuracy);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished]);

  const progress = Math.round((cursorIndex / chars.length) * 100);

  function handleSelectLength(count: number) {
    setMode("words");
    setWordCount(count);
    const next = generateWords(count);
    setText(next);
    reset(next);
  }

  function handleSelectCustom(customText: string) {
    setMode("custom");
    setText(customText);
    reset(customText);
  }

  function handleNewText() {
    if (mode === "custom") {
      reset(text);
    } else {
      const next = generateWords(wordCount);
      setText(next);
      reset(next);
    }
  }

  function handleToggleWord(word: string) {
    if (isMarked(word)) {
      unmarkWord(word);
    } else {
      markWord(word);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
        Type<span className="text-emerald-400">Mor</span>
      </h1>

    <p className="text-sm text-zinc-500 mb-6">
        {rank.name} · <span className="text-emerald-400 font-semibold">{points}</span> pts
      </p>

      <TextSelector
        onSelectLength={handleSelectLength}
        onSelectCustom={handleSelectCustom}
        currentMode={mode}
        currentCount={wordCount}
      />

      <StatsBar stats={stats} progress={progress} />

      <TypingArea
        chars={chars}
        cursorIndex={cursorIndex}
        onKeyInput={handleKeyInput}
        disabled={isFinished}
      />

      {isFinished && (
        <>
          <div className="mt-6 text-center">
            <p className="text-emerald-400 text-lg font-semibold mb-3">
              🎉 Finished! {stats.wpm} WPM · {stats.accuracy}% accuracy
            </p>
            <button
              onClick={handleNewText}
              className="px-5 py-2 rounded-lg bg-emerald-500 text-zinc-950 font-medium hover:bg-emerald-400 transition"
            >
              Try another text
            </button>
          </div>

          <WordReview
            text={text}
            isWordMarked={isMarked}
            onToggleWord={handleToggleWord}
          />
        </>
      )}

      {!isFinished && (
        <button
          onClick={handleNewText}
          className="mt-6 text-zinc-500 hover:text-zinc-300 text-sm transition"
        >
          ↻ Restart with new text
        </button>
      )}
    </main>
  );
}
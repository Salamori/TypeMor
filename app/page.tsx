"use client";

import { useState, useEffect } from "react";
import { useTypingEngine } from "@/hooks/useTypingEngine";
import { useVocabulary } from "@/hooks/useVocabulary";
import { TypingArea } from "@/components/TypingArea";
import { StatsBar } from "@/components/StatsBar";
import { TextSelector } from "@/components/TextSelector";
import { WordReview } from "@/components/WordReview";
import { SAMPLE_TEXTS } from "@/lib/sample-texts";
import { checkWordsInText } from "@/lib/vocabulary";
import { generateWords } from "@/lib/word-pool";
import Link from "next/link";
import { LevelBar } from "@/components/LevelBar";

export default function Home() {
  const [text, setText] = useState(SAMPLE_TEXTS[0]);
  const [mode, setMode] = useState<"words" | "custom">("words");
 const [wordCount, setWordCount] = useState(25);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const { chars, cursorIndex, stats, isFinished, handleKeyInput, reset } =
    useTypingEngine(text);
  const { points, rank, isMarked, markWord, unmarkWord, recordSessionResult, recordCorrectRetype } =
    useVocabulary();

 useEffect(() => {
    const initial = generateWords(25, "easy");
    setText(initial);
    reset(initial);
  }, []);
useEffect(() => {
    if (isFinished) {
      // Only count toward personal records if it's a generated text
      // of reasonable length (custom texts and very short texts can
      // produce unrealistic WPM spikes).
      const countsForRecords = mode === "words" && text.length >= 15;
      recordSessionResult(stats.wpm, stats.accuracy, countsForRecords);

      const charStatuses = chars.map((c) => c.status);
      const wordResults = checkWordsInText(text, charStatuses);
      for (const result of wordResults) {
        if (result.correct && isMarked(result.word)) {
          recordCorrectRetype(result.word);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished]);
  const progress = Math.round((cursorIndex / chars.length) * 100);

 function handleSelectLength(count: number, diff: "easy" | "medium" | "hard") {
    setMode("words");
    setWordCount(count);
    setDifficulty(diff);
    const next = generateWords(count, diff);
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
      const next = generateWords(wordCount, difficulty);
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
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-3 sm:px-4 py-6 sm:py-12">
      <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
        Type<span className="text-emerald-400">Mor</span>
      </h1>

  <LevelBar points={points} />

     <TextSelector
        onSelectLength={handleSelectLength}
        onSelectCustom={handleSelectCustom}
        currentMode={mode}
        currentCount={wordCount}
        currentDifficulty={difficulty}
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
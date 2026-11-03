"use client";

import { useState, useEffect } from "react";
import { useTypingEngine } from "@/hooks/useTypingEngine";
import { useVocabulary } from "@/hooks/useVocabulary";
import { TypingArea } from "@/components/TypingArea";
import { StatsBar } from "@/components/StatsBar";
import { TextSelector } from "@/components/TextSelector";
import { WordReview } from "@/components/WordReview";
import { checkWordsInText } from "@/lib/vocabulary";
import { generateWords, Difficulty } from "@/lib/word-pool";
import { LevelBar } from "@/components/LevelBar";
import { useStreak } from "@/hooks/useStreak";
import { useDailyQuests } from "@/hooks/useDailyQuests";
import { useHydrated } from "@/lib/store";

export default function TypePage() {
  // Generated text is random, so render the session only on the client
  // to avoid a hydration mismatch.
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-500">Loading...</p>
      </main>
    );
  }

  return <TypingSession />;
}

function TypingSession() {
  const [mode, setMode] = useState<"words" | "custom">("words");
  const [wordCount, setWordCount] = useState(25);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [initialText] = useState(() => generateWords(25, "easy"));
  const { text, chars, cursorIndex, stats, isFinished, handleKeyInput, reset } =
    useTypingEngine(initialText);
  const { points, isMarked, markWord, unmarkWord, recordSessionResult, recordCorrectRetype } =
    useVocabulary();
  const { markActive } = useStreak();
  const { progressQuest } = useDailyQuests();

  useEffect(() => {
    if (!isFinished) return;

    markActive();
    progressQuest("type_texts");

    // Only count toward personal records if it's a generated text
    // of reasonable length (custom texts and very short texts can
    // produce unrealistic WPM spikes).
    const countsForRecords = mode === "words" && text.length >= 15;
    recordSessionResult(stats.wpm, stats.accuracy, countsForRecords);

    // A word repeated in one text only counts once toward mastery.
    const charStatuses = chars.map((c) => c.status);
    const seen = new Set<string>();
    for (const result of checkWordsInText(text, charStatuses)) {
      if (!result.correct || seen.has(result.word)) continue;
      seen.add(result.word);
      if (recordCorrectRetype(result.word)) {
        progressQuest("master_words");
      }
    }
    // Run once per finished session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished]);

  const progress = chars.length > 0 ? Math.round((cursorIndex / chars.length) * 100) : 0;

  function handleSelectLength(count: number, diff: Difficulty) {
    setMode("words");
    setWordCount(count);
    setDifficulty(diff);
    reset(generateWords(count, diff));
  }

  function handleSelectCustom(customText: string) {
    setMode("custom");
    reset(customText);
  }

  function handleNewText() {
    if (mode === "custom") {
      reset(text);
    } else {
      reset(generateWords(wordCount, difficulty));
    }
  }

  function handleToggleWord(word: string) {
    if (isMarked(word)) {
      unmarkWord(word);
    } else if (markWord(word)) {
      progressQuest("mark_words");
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
              {mode === "custom" ? "Type it again" : "Try another text"}
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
          {mode === "custom" ? "↻ Restart" : "↻ Restart with new text"}
        </button>
      )}
    </main>
  );
}

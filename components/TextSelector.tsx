"use client";

import { useState } from "react";
import type { Difficulty } from "@/lib/word-pool";

interface TextSelectorProps {
  onSelectLength: (count: number, difficulty: Difficulty) => void;
  onSelectCustom: (text: string) => void;
  currentMode: "words" | "custom";
  currentCount: number;
  currentDifficulty: Difficulty;
}

const WORD_OPTIONS = [10, 25, 50, 100];
const DIFFICULTY_OPTIONS: { value: Difficulty; label: string }[] = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

export function TextSelector({
  onSelectLength,
  onSelectCustom,
  currentMode,
  currentCount,
  currentDifficulty,
}: TextSelectorProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customText, setCustomText] = useState("");

  function handleCustomSubmit() {
    if (customText.trim().length > 0) {
      onSelectCustom(customText.trim());
      setShowCustomInput(false);
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto mb-6">
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap mb-2">
        {WORD_OPTIONS.map((count) => (
          <button
            key={count}
            onClick={() => onSelectLength(count, currentDifficulty)}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition ${
              currentMode === "words" && currentCount === count
                ? "bg-emerald-500 text-zinc-950"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            }`}
          >
            {count}
          </button>
        ))}
        <button
          onClick={() => setShowCustomInput((v) => !v)}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
            currentMode === "custom"
              ? "bg-emerald-500 text-zinc-950"
              : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
          }`}
        >
          Custom text
        </button>
      </div>

      <div className="flex items-center justify-center gap-2">
        <span className="text-xs text-zinc-600 mr-1">Difficulty:</span>
        {DIFFICULTY_OPTIONS.map((d) => (
          <button
            key={d.value}
            onClick={() => onSelectLength(currentCount, d.value)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
              currentDifficulty === d.value
                ? "bg-amber-500 text-zinc-950"
                : "bg-zinc-800 text-zinc-500 hover:bg-zinc-700"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {showCustomInput && (
        <div className="mt-4 flex flex-col gap-2">
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Paste your own text or phrases here..."
            className="w-full h-28 p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm font-mono resize-none focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={handleCustomSubmit}
            className="self-end px-4 py-1.5 rounded-lg bg-emerald-500 text-zinc-950 text-sm font-medium hover:bg-emerald-400 transition"
          >
            Use this text
          </button>
        </div>
      )}
    </div>
  );
}
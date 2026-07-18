"use client";

import { useState } from "react";

interface TextSelectorProps {
  onSelectLength: (count: number) => void;
  onSelectCustom: (text: string) => void;
  currentMode: "words" | "custom";
  currentCount: number;
}

const WORD_OPTIONS = [10, 25, 50, 100];

export function TextSelector({
  onSelectLength,
  onSelectCustom,
  currentMode,
  currentCount,
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
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {WORD_OPTIONS.map((count) => (
          <button
            key={count}
            onClick={() => onSelectLength(count)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
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
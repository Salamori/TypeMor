"use client";

import { useState } from "react";
import { checkWriting, WritingMatch } from "@/lib/writing";
import { WritingErrors } from "@/components/WritingErrors";
import { useVocabulary } from "@/hooks/useVocabulary";
import { useStreak } from "@/hooks/useStreak";
import { useDailyQuests } from "@/hooks/useDailyQuests";

export function WritingEditor() {
  const [text, setText] = useState("");
  const [matches, setMatches] = useState<WritingMatch[] | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState(false);
  const { markWord } = useVocabulary();
  const { markActive } = useStreak();
  const { progressQuest } = useDailyQuests();

  async function handleCheck() {
    if (text.trim().length === 0) return;
    setChecking(true);
    setError(false);
    setMatches(null);

    const result = await checkWriting(text);
    setChecking(false);

    if (!result) {
      setError(true);
      return;
    }

   setMatches(result.matches);
    markActive();
    progressQuest("write_essay");

    // Auto-add words with errors to vocabulary
    for (const word of result.errorWords) {
      markWord(word);
    }
  }

  function renderHighlightedText() {
    if (!matches || matches.length === 0) return text;

    const sorted = [...matches].sort((a, b) => a.offset - b.offset);
    const parts: React.ReactNode[] = [];
    let cursor = 0;

    sorted.forEach((m, i) => {
      if (m.offset > cursor) {
        parts.push(text.slice(cursor, m.offset));
      }
      parts.push(
        <span
          key={i}
          className="underline decoration-red-500 decoration-wavy decoration-2 underline-offset-2"
          title={m.message}
        >
          {text.slice(m.offset, m.offset + m.length)}
        </span>
      );
      cursor = m.offset + m.length;
    });

    if (cursor < text.length) {
      parts.push(text.slice(cursor));
    }

    return parts;
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {matches === null ? (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write anything — an essay, a paragraph, your thoughts. Then check it for mistakes."
          className="w-full h-64 p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 text-base leading-relaxed resize-none focus:outline-none focus:border-emerald-500"
        />
      ) : (
        <div className="w-full min-h-64 p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 text-base leading-relaxed whitespace-pre-wrap">
          {renderHighlightedText()}
        </div>
      )}

      <div className="flex items-center justify-between mt-3">
        <p className="text-xs text-zinc-600">
          {matches !== null
            ? `${matches.length} issue${matches.length === 1 ? "" : "s"} found`
            : `${text.length} characters`}
        </p>
        <div className="flex gap-2">
          {matches !== null && (
            <button
              onClick={() => setMatches(null)}
              className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-700 transition"
            >
              Edit again
            </button>
          )}
          <button
            onClick={handleCheck}
            disabled={checking || text.trim().length === 0}
            className="px-4 py-2 rounded-lg bg-emerald-500 text-zinc-950 text-sm font-medium hover:bg-emerald-400 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {checking ? "Checking..." : "Check my writing"}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-sm mt-2">
          Couldn&apos;t check your writing right now. Please try again.
        </p>
      )}

      {matches !== null && <WritingErrors matches={matches} />}
    </div>
  );
}
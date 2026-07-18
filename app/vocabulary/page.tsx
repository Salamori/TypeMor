"use client";

import { useState } from "react";
import Link from "next/link";
import { useVocabulary } from "@/hooks/useVocabulary";

type Filter = "all" | "learning" | "mastered";

export default function VocabularyPage() {
  const { words, points, rank, markWord, unmarkWord, loaded } = useVocabulary();
  const [filter, setFilter] = useState<Filter>("all");
  const [newWord, setNewWord] = useState("");

  const wordList = Object.values(words).sort((a, b) => b.addedAt - a.addedAt);

  const filtered = wordList.filter((w) => {
    if (filter === "learning") return !w.mastered;
    if (filter === "mastered") return w.mastered;
    return true;
  });

  const masteredCount = wordList.filter((w) => w.mastered).length;

  function handleAddWord() {
    const trimmed = newWord.trim();
    if (trimmed.length > 0) {
      markWord(trimmed);
      setNewWord("");
    }
  }

  if (!loaded) {
    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="text-sm text-zinc-500 hover:text-zinc-300 transition"
          >
            ← Back to typing
          </Link>
          <p className="text-sm text-zinc-500">
            {rank.name} · <span className="text-emerald-400 font-semibold">{points}</span> pts
          </p>
        </div>

        <h1 className="text-3xl font-bold text-white mb-1">
          My <span className="text-emerald-400">Vocabulary</span>
        </h1>
        <p className="text-zinc-500 text-sm mb-6">
          {wordList.length} words · {masteredCount} mastered
        </p>

        {/* Add word manually */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddWord()}
            placeholder="Add a word or phrase manually..."
            className="flex-1 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={handleAddWord}
            className="px-4 py-2 rounded-lg bg-emerald-500 text-zinc-950 text-sm font-medium hover:bg-emerald-400 transition"
          >
            Add
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(["all", "learning", "mastered"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition capitalize ${
                filter === f
                  ? "bg-emerald-500 text-zinc-950"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Word list */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-zinc-600">
            <p>No words here yet.</p>
            <p className="text-sm mt-1">
              Mark unknown words after a typing session, or add one above.
            </p>
          </div>
        ) : (
          <div className="grid gap-2">
            {filtered.map((w) => (
              <div
                key={w.word}
                className="flex items-center justify-between px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-zinc-200">{w.word}</span>
                  {w.mastered ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                      ✓ Mastered
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                      {w.correctStreak}/3 streak
                    </span>
                  )}
                </div>
                <button
                  onClick={() => unmarkWord(w.word)}
                  className="text-zinc-600 hover:text-red-400 transition text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
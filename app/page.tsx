"use client";

import Link from "next/link";
import { useVocabulary } from "@/hooks/useVocabulary";
import { useStreak } from "@/hooks/useStreak";
import { StreakCard } from "@/components/StreakCard";
import { DailyQuestsCard } from "@/components/DailyQuestsCard";
import { LevelBar } from "@/components/LevelBar";

export default function DashboardPage() {
  const { points, stats, words, loaded } = useVocabulary();
  const { loaded: streakLoaded } = useStreak();

  const wordList = Object.values(words);
  const masteredCount = wordList.filter((w) => w.mastered).length;

  if (!loaded || !streakLoaded) {
    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-10 sm:py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Welcome back to <span className="text-emerald-400">TypeMor</span>
            </h1>
          </div>
          <StreakCard />
        </div>

        <div className="mb-6">
          <LevelBar points={points} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <DailyQuestsCard />

          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
            <p className="text-sm text-zinc-500 mb-3">Your stats</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xl font-bold text-emerald-400">{stats.bestWpm}</p>
                <p className="text-xs text-zinc-600">Best WPM</p>
              </div>
              <div>
                <p className="text-xl font-bold text-emerald-400">{stats.bestAccuracy}%</p>
                <p className="text-xs text-zinc-600">Best Accuracy</p>
              </div>
              <div>
                <p className="text-xl font-bold text-emerald-400">{wordList.length}</p>
                <p className="text-xs text-zinc-600">Words Saved</p>
              </div>
              <div>
                <p className="text-xl font-bold text-emerald-400">{masteredCount}</p>
                <p className="text-xs text-zinc-600">Words Mastered</p>
              </div>
            </div>
          </div>
        </div>

        <Link
          href="/type"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 text-zinc-950 font-medium hover:bg-emerald-400 transition"
        >
          Continue practicing →
        </Link>
      </div>
    </main>
  );
}
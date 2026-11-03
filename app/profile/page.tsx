"use client";

import { useVocabulary } from "@/hooks/useVocabulary";
import { useAchievements } from "@/hooks/useAchievements";
import { getLevelState } from "@/lib/levels";
import { createLocalStore, useLocalStore } from "@/lib/store";

const titleStore = createLocalStore<string | null>("typemor_active_title", null, (raw) =>
  typeof raw === "string" && raw.length > 0 ? raw : null
);

export default function ProfilePage() {
  const { points, stats, words, loaded } = useVocabulary();
  const { unlocked } = useAchievements();
  const storedTitle = useLocalStore(titleStore);
  // Only show a title the user still has unlocked.
  const activeTitle = unlocked.some((a) => a.titleReward === storedTitle) ? storedTitle : null;

  function selectTitle(title: string | null) {
    titleStore.set(title);
  }

  if (!loaded) {
    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-500">Loading...</p>
      </main>
    );
  }

  const level = getLevelState(points);
  const wordList = Object.values(words);
  const masteredCount = wordList.filter((w) => w.mastered).length;

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-1">
            {activeTitle ? (
              <>
                <span className="text-emerald-400">{activeTitle}</span>
              </>
            ) : (
              <>
                Level <span className="text-emerald-400">{level.level}</span>
              </>
            )}
          </h1>
          <p className="text-zinc-500 text-sm">
            {level.rankName} · {points} pts
          </p>
          {!level.isMaxLevel && (
            <div className="max-w-xs mx-auto mt-3">
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all"
                  style={{ width: `${level.progressPercent}%` }}
                />
              </div>
              <p className="text-xs text-zinc-600 mt-1">
                {level.pointsToNextLevel} pts to Level {level.level + 1}
              </p>
            </div>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          <StatCard label="Texts Completed" value={stats.textsCompleted} />
          <StatCard label="Best WPM" value={stats.bestWpm} />
          <StatCard label="Best Accuracy" value={`${stats.bestAccuracy}%`} />
          <StatCard label="Perfect Runs" value={stats.perfectRuns} />
          <StatCard label="Words Marked" value={wordList.length} />
          <StatCard label="Words Mastered" value={masteredCount} />
        </div>

        {/* Title selector */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Choose Your Title</h2>
          {unlocked.length === 0 ? (
            <p className="text-zinc-600 text-sm">
              Complete achievements to unlock titles.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => selectTitle(null)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  !activeTitle
                    ? "bg-emerald-500 text-zinc-950"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                }`}
              >
                None (show level)
              </button>
              {unlocked.map((a) => (
                <button
                  key={a.id}
                  onClick={() => selectTitle(a.titleReward)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    activeTitle === a.titleReward
                      ? "bg-emerald-500 text-zinc-950"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  }`}
                >
                  {a.icon} {a.titleReward}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
      <p className="text-2xl font-bold text-emerald-400">{value}</p>
      <p className="text-xs text-zinc-500 mt-1">{label}</p>
    </div>
  );
}
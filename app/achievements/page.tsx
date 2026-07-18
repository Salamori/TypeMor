"use client";

import { useAchievements } from "@/hooks/useAchievements";

export default function AchievementsPage() {
  const { all, unlockedIds, loaded } = useAchievements();

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
        <h1 className="text-3xl font-bold text-white mb-1">
          <span className="text-emerald-400">Achievements</span>
        </h1>
        <p className="text-zinc-500 text-sm mb-8">
          {unlockedIds.size} / {all.length} unlocked
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {all.map((a) => {
            const isUnlocked = unlockedIds.has(a.id);
            return (
              <div
                key={a.id}
                className={`p-4 rounded-xl border flex items-start gap-3 transition ${
                  isUnlocked
                    ? "bg-zinc-900 border-emerald-800"
                    : "bg-zinc-950 border-zinc-900 opacity-50"
                }`}
              >
                <span className="text-2xl">{isUnlocked ? a.icon : "🔒"}</span>
                <div>
                  <p className="text-zinc-200 font-medium text-sm">{a.title}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">{a.description}</p>
                  {isUnlocked && (
                    <p className="text-emerald-400 text-xs mt-1">
                      Title unlocked: &quot;{a.titleReward}&quot;
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
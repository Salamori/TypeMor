import type { TypingStats } from "@/hooks/useTypingEngine";

interface StatsBarProps {
  stats: TypingStats;
  progress: number; // 0..100
}

export function StatsBar({ stats, progress }: StatsBarProps) {
  return (
    <div className="w-full max-w-3xl mx-auto mb-6">
      <div className="flex justify-between text-sm text-zinc-400 mb-2 font-mono">
        <span>
          WPM: <span className="text-emerald-400 font-bold">{stats.wpm}</span>
        </span>
        <span>
          Accuracy: <span className="text-sky-400 font-bold">{stats.accuracy}%</span>
        </span>
        <span>
          Time: <span className="text-amber-400 font-bold">{stats.elapsedSeconds}s</span>
        </span>
      </div>
      <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
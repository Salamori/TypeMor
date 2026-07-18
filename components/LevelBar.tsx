import { getLevelState } from "@/lib/levels";

interface LevelBarProps {
  points: number;
}

export function LevelBar({ points }: LevelBarProps) {
  const level = getLevelState(points);

  return (
    <div className="w-full max-w-xs mx-auto mb-2">
      <div className="flex justify-between text-xs text-zinc-500 mb-1">
        <span>
          Level <span className="text-emerald-400 font-semibold">{level.level}</span> ·{" "}
          {level.rankName}
        </span>
        {!level.isMaxLevel && <span>{level.pointsToNextLevel} pts to next</span>}
      </div>
      <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 transition-all duration-300 ease-out"
          style={{ width: `${level.progressPercent}%` }}
        />
      </div>
    </div>
  );
}
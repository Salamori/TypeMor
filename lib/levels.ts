export interface LevelInfo {
  level: number;
  pointsRequired: number;
  rankName: string;
}

// Every level requires progressively more points.
// Ranks group levels together (levels 1-3 = Beginner, etc).
export const LEVELS: LevelInfo[] = [
  { level: 1, pointsRequired: 0, rankName: "Beginner" },
  { level: 2, pointsRequired: 30, rankName: "Beginner" },
  { level: 3, pointsRequired: 70, rankName: "Beginner" },
  { level: 4, pointsRequired: 120, rankName: "Apprentice" },
  { level: 5, pointsRequired: 180, rankName: "Apprentice" },
  { level: 6, pointsRequired: 260, rankName: "Apprentice" },
  { level: 7, pointsRequired: 360, rankName: "Skilled" },
  { level: 8, pointsRequired: 480, rankName: "Skilled" },
  { level: 9, pointsRequired: 620, rankName: "Skilled" },
  { level: 10, pointsRequired: 780, rankName: "Expert" },
  { level: 11, pointsRequired: 960, rankName: "Expert" },
  { level: 12, pointsRequired: 1160, rankName: "Expert" },
  { level: 13, pointsRequired: 1400, rankName: "Master" },
  { level: 14, pointsRequired: 1680, rankName: "Master" },
  { level: 15, pointsRequired: 2000, rankName: "Master" },
  { level: 16, pointsRequired: 2400, rankName: "Legend" },
  { level: 17, pointsRequired: 2900, rankName: "Legend" },
  { level: 18, pointsRequired: 3500, rankName: "Legend" },
];

export interface CurrentLevelState {
  level: number;
  rankName: string;
  currentLevelPoints: number; // points into the current level
  pointsToNextLevel: number; // points needed to reach next level (0 if max)
  progressPercent: number; // 0..100
  isMaxLevel: boolean;
}

export function getLevelState(points: number): CurrentLevelState {
  let current = LEVELS[0];
  let next: LevelInfo | null = null;

  for (let i = 0; i < LEVELS.length; i++) {
    if (points >= LEVELS[i].pointsRequired) {
      current = LEVELS[i];
      next = LEVELS[i + 1] ?? null;
    }
  }

  if (!next) {
    return {
      level: current.level,
      rankName: current.rankName,
      currentLevelPoints: points - current.pointsRequired,
      pointsToNextLevel: 0,
      progressPercent: 100,
      isMaxLevel: true,
    };
  }

  const span = next.pointsRequired - current.pointsRequired;
  const into = points - current.pointsRequired;
  const progressPercent = Math.min(100, Math.round((into / span) * 100));

  return {
    level: current.level,
    rankName: current.rankName,
    currentLevelPoints: into,
    pointsToNextLevel: next.pointsRequired - points,
    progressPercent,
    isMaxLevel: false,
  };
}
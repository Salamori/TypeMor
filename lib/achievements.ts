export interface AchievementStats {
  textsCompleted: number;
  bestWpm: number;
  bestAccuracy: number;
  perfectRuns: number; // 100% accuracy completions
  wordsMarked: number;
  wordsMastered: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  titleReward: string; // the "title" unlocked, shown with an icon
  icon: string;
  check: (stats: AchievementStats) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-steps",
    title: "First Steps",
    description: "Complete your first typing session",
    titleReward: "Newcomer",
    icon: "🌱",
    check: (s) => s.textsCompleted >= 1,
  },
  {
    id: "ten-texts",
    title: "Getting the Hang of It",
    description: "Complete 10 typing sessions",
    titleReward: "Regular",
    icon: "📘",
    check: (s) => s.textsCompleted >= 10,
  },
  {
    id: "fifty-texts",
    title: "Dedicated Typist",
    description: "Complete 50 typing sessions",
    titleReward: "Veteran",
    icon: "📚",
    check: (s) => s.textsCompleted >= 50,
  },
  {
    id: "speed-40",
    title: "Warming Up",
    description: "Reach 40 WPM",
    titleReward: "Quick Fingers",
    icon: "⚡",
    check: (s) => s.bestWpm >= 40,
  },
  {
    id: "speed-60",
    title: "Speed Demon",
    description: "Reach 60 WPM",
    titleReward: "Speed Demon",
    icon: "🔥",
    check: (s) => s.bestWpm >= 60,
  },
  {
    id: "speed-100",
    title: "Lightning Fingers",
    description: "Reach 100 WPM",
    titleReward: "Lightning",
    icon: "🌩️",
    check: (s) => s.bestWpm >= 100,
  },
  {
    id: "perfect-1",
    title: "Perfectionist",
    description: "Complete a text with 100% accuracy",
    titleReward: "Perfectionist",
    icon: "🎯",
    check: (s) => s.perfectRuns >= 1,
  },
  {
    id: "perfect-5",
    title: "Flawless x5",
    description: "Complete 5 texts with 100% accuracy",
    titleReward: "Flawless",
    icon: "💎",
    check: (s) => s.perfectRuns >= 5,
  },
  {
    id: "words-10",
    title: "Word Collector",
    description: "Mark 10 words as unknown",
    titleReward: "Collector",
    icon: "🗂️",
    check: (s) => s.wordsMarked >= 10,
  },
  {
    id: "words-mastered-10",
    title: "Vocabulary Builder",
    description: "Master 10 words",
    titleReward: "Builder",
    icon: "🏗️",
    check: (s) => s.wordsMastered >= 10,
  },
  {
    id: "words-mastered-50",
    title: "Vocabulary Master",
    description: "Master 50 words",
    titleReward: "Wordsmith",
    icon: "📖",
    check: (s) => s.wordsMastered >= 50,
  },
  {
    id: "words-mastered-100",
    title: "Polyglot in Training",
    description: "Master 100 words",
    titleReward: "Polyglot",
    icon: "🌍",
    check: (s) => s.wordsMastered >= 100,
  },
];

export function getUnlockedAchievements(stats: AchievementStats): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.check(stats));
}
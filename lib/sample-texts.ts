export const SAMPLE_TEXTS: string[] = [
  "The quick brown fox jumps over the lazy dog while the sun slowly sets behind the mountains.",
  "Learning to type faster requires consistent practice and focus on accuracy before speed.",
  "Every great developer was once a beginner who refused to give up on their dreams.",
  "Success is not final, failure is not fatal, it is the courage to continue that counts.",
];

export function getRandomText(): string {
  return SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
}
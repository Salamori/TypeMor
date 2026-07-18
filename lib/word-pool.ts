export const WORD_POOL: string[] = [
  "the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog", "runs", "fast",
  "learn", "type", "words", "practice", "makes", "perfect", "every", "day", "code",
  "computer", "keyboard", "screen", "mouse", "write", "read", "think", "create",
  "build", "design", "system", "language", "english", "grammar", "sentence", "word",
  "phrase", "meaning", "study", "focus", "improve", "skill", "speed", "accuracy",
  "correct", "mistake", "error", "fix", "review", "memory", "remember", "forget",
  "know", "understand", "explain", "teach", "student", "teacher", "school", "book",
  "page", "chapter", "story", "novel", "author", "write", "author", "idea", "thought",
  "mind", "brain", "smart", "clever", "wise", "knowledge", "power", "strength",
  "energy", "time", "clock", "minute", "second", "hour", "today", "tomorrow",
  "yesterday", "future", "past", "present", "moment", "life", "world", "people",
  "friend", "family", "home", "house", "city", "country", "travel", "journey",
];

export function generateWords(count: number): string {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    words.push(WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)]);
  }
  return words.join(" ") + ".";
}
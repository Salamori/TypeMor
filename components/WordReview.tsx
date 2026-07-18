"use client";

interface WordReviewProps {
  text: string;
  isWordMarked: (word: string) => boolean;
  onToggleWord: (word: string) => void;
}

function normalizeForClick(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z']/g, "");
}

export function WordReview({ text, isWordMarked, onToggleWord }: WordReviewProps) {
  const words = text.split(" ");

  return (
    <div className="w-full max-w-3xl mx-auto mt-6">
      <p className="text-center text-xs text-zinc-600 mb-3">
        Click any word you didn&apos;t know
      </p>
      <div className="text-lg leading-relaxed font-mono p-5 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-wrap gap-x-2">
        {words.map((raw, i) => {
          const clean = normalizeForClick(raw);
          const marked = clean.length > 0 && isWordMarked(clean);
          return (
            <span
              key={i}
              onClick={() => clean && onToggleWord(clean)}
              className={
                "cursor-pointer transition rounded px-0.5 " +
                (marked
                  ? "bg-amber-400/20 text-amber-300 underline decoration-amber-400 decoration-2 underline-offset-4"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800")
              }
            >
              {raw}
            </span>
          );
        })}
      </div>
    </div>
  );
}
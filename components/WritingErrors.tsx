import type { WritingMatch } from "@/lib/writing";

interface WritingErrorsProps {
  matches: WritingMatch[];
}

export function WritingErrors({ matches }: WritingErrorsProps) {
  if (matches.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-6 text-center py-8">
        <p className="text-emerald-400 font-medium">🎉 No mistakes found!</p>
        <p className="text-zinc-600 text-sm mt-1">Your writing looks clean.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-6">
      <p className="text-sm text-zinc-500 mb-3">
        Found {matches.length} issue{matches.length === 1 ? "" : "s"} —
        flagged words were added to your vocabulary.
      </p>
      <div className="grid gap-2">
        {matches.map((m, i) => (
          <div
            key={i}
            className="p-3 rounded-lg bg-zinc-900 border border-zinc-800"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
                {m.category}
              </span>
            </div>
            <p className="text-zinc-300 text-sm">{m.message}</p>
            {m.replacements.length > 0 && (
              <p className="text-xs text-zinc-500 mt-1">
                Suggestions:{" "}
                <span className="text-emerald-400">
                  {m.replacements.join(", ")}
                </span>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
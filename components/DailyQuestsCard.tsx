"use client";

import { useDailyQuests } from "@/hooks/useDailyQuests";
import { QUEST_DEFINITIONS } from "@/lib/dailyQuests";

export function DailyQuestsCard() {
  const { state, loaded } = useDailyQuests();

  if (!loaded) return null;

  return (
    <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
      <p className="text-sm text-zinc-500 mb-3">Today&apos;s quests</p>
      <div className="flex flex-col gap-2">
        {state.quests.map((q) => {
          const def = QUEST_DEFINITIONS.find((d) => d.type === q.type);
          if (!def) return null;
          const done = q.progress >= q.target;
          return (
            <div key={q.type} className="flex items-center gap-2 text-sm">
              <span>{done ? "✅" : def.icon}</span>
              <span className={done ? "text-zinc-500 line-through" : "text-zinc-300"}>
                {def.label(q.target)}
              </span>
              <span className="ml-auto text-xs text-zinc-600">
                {q.progress}/{q.target}
              </span>
            </div>
          );
        })}
        {state.quests.length === 0 && (
          <p className="text-zinc-600 text-sm">No quests set up yet.</p>
        )}
      </div>
    </div>
  );
}
"use client";

import { useEffect, useRef } from "react";
import type { CharState } from "@/hooks/useTypingEngine";

interface TypingAreaProps {
  chars: CharState[];
  cursorIndex: number;
  onKeyInput: (key: string) => void;
  disabled?: boolean;
}

export function TypingArea({ chars, cursorIndex, onKeyInput, disabled }: TypingAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    cursorRef.current?.scrollIntoView({
      block: "center",
      behavior: "smooth",
    });
  }, [cursorIndex]);

  return (
    <div
      className="relative w-full max-w-3xl mx-auto cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      <input
        ref={inputRef}
        type="text"
        className="absolute opacity-0 pointer-events-none"
        disabled={disabled}
        onKeyDown={(e) => {
          if (e.key.length === 1 || e.key === "Backspace") {
            e.preventDefault();
            onKeyInput(e.key);
          }
        }}
      />
      <div
        ref={containerRef}
        className="text-2xl leading-relaxed font-mono tracking-wide select-none p-6 rounded-xl bg-zinc-900 border border-zinc-800 h-[168px] overflow-hidden"
      >
        {chars.map((c, i) => (
          <span
            key={i}
            ref={i === cursorIndex ? cursorRef : null}
            className={
              c.status === "correct"
                ? "text-emerald-400"
                : c.status === "incorrect"
                ? "text-red-400 bg-red-950/50"
                : "text-zinc-500"
            }
          >
            {i === cursorIndex && (
              <span className="border-l-2 border-emerald-400 animate-pulse absolute -ml-[1px]" />
            )}
            {c.char}
          </span>
        ))}
      </div>
    </div>
  );
}
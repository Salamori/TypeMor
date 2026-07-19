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
  const typedRef = useRef("");

 useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (cursorIndex === 0) {
      typedRef.current = "";
      if (inputRef.current) inputRef.current.value = "";
    }
  }, [chars]);

  useEffect(() => {
    cursorRef.current?.scrollIntoView({
      block: "center",
      behavior: "smooth",
    });
  }, [cursorIndex]);

 function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    console.log("INPUT EVENT FIRED:", e.target.value);
    const value = e.target.value;
    const prev = typedRef.current;

    if (value.length > prev.length) {
      // character(s) added
      const added = value.slice(prev.length);
      for (const ch of added) {
        onKeyInput(ch);
      }
    } else if (value.length < prev.length) {
      // backspace
      const diff = prev.length - value.length;
      for (let i = 0; i < diff; i++) {
        onKeyInput("Backspace");
      }
    }

    typedRef.current = value;
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // Physical keyboards: handle directly for reliability (desktop)
    if (e.key.length === 1) {
      e.preventDefault();
      onKeyInput(e.key);
      return;
    }
    if (e.key === "Backspace") {
      e.preventDefault();
      onKeyInput("Backspace");
    }
  }

  return (
    <div
      className="relative w-full max-w-3xl mx-auto cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
     <input
        ref={inputRef}
        type="text"
        inputMode="text"
        autoCapitalize="none"
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
        disabled={disabled}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        suppressHydrationWarning
        className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-text"
      />
      <div className="text-lg sm:text-2xl leading-relaxed font-mono tracking-wide select-none p-4 sm:p-6 rounded-xl bg-zinc-900 border border-zinc-800 h-[140px] sm:h-[168px] overflow-hidden">
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
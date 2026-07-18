"use client";

import { useState, useEffect, useRef } from "react";
import { fetchDefinition, fetchTranslation, DictionaryEntry } from "@/lib/dictionary";

interface WordDefinitionProps {
  word: string;
  onClose: () => void;
}

export function WordDefinition({ word, onClose }: WordDefinitionProps) {
  const [entry, setEntry] = useState<DictionaryEntry | null>(null);
  const [translation, setTranslation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setEntry(null);
    setTranslation(null);

    Promise.all([fetchDefinition(word), fetchTranslation(word)]).then(
      ([defResult, transResult]) => {
        if (cancelled) return;
        setLoading(false);
        if (!defResult) {
          setNotFound(true);
        } else {
          setEntry(defResult);
        }
        setTranslation(transResult);
      }
    );

    return () => {
      cancelled = true;
    };
  }, [word]);

  function playAudio() {
    audioRef.current?.play();
  }

  return (
    <div className="mt-3 p-4 rounded-lg bg-zinc-950 border border-zinc-800">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-emerald-400 font-semibold">{word}</span>
          {entry?.phonetic && (
            <span className="text-zinc-500 text-sm">{entry.phonetic}</span>
          )}
          {entry?.audioUrl && (
            <>
              <button
                onClick={playAudio}
                className="text-zinc-500 hover:text-emerald-400 transition text-sm"
                aria-label="Play pronunciation"
              >
                🔊
              </button>
              <audio ref={audioRef} src={entry.audioUrl} />
            </>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-zinc-600 hover:text-zinc-300 transition text-sm"
        >
          ✕
        </button>
      </div>

      {loading && <p className="text-zinc-600 text-sm">Loading definition...</p>}

      {notFound && (
        <p className="text-zinc-600 text-sm">
          No definition found for this word.
        </p>
      )}

      {entry && (
        <div className="space-y-2">
          {entry.definitions.map((d, i) => (
            <div key={i} className="text-sm">
              <span className="text-zinc-600 italic mr-2">{d.partOfSpeech}</span>
              <span className="text-zinc-300">{d.meaning}</span>
              {d.example && (
                <p className="text-zinc-600 text-xs mt-0.5 ml-1">&quot;{d.example}&quot;</p>
              )}
            </div>
          ))}
        </div>
      )}

      {translation && (
        <div className="mt-3 pt-3 border-t border-zinc-800">
          <span className="text-zinc-600 text-xs mr-2">🇷🇺 Russian:</span>
          <span className="text-zinc-300 text-sm">{translation}</span>
        </div>
      )}
    </div>
  );
}
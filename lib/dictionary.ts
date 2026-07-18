export interface Definition {
  partOfSpeech: string;
  meaning: string;
  example?: string;
}

export interface DictionaryEntry {
  word: string;
  phonetic?: string;
  audioUrl?: string;
  definitions: Definition[];
}

export async function fetchDefinition(word: string): Promise<DictionaryEntry | null> {
  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
    );
    if (!res.ok) return null;

    const data = await res.json();
    const entry = data[0];
    if (!entry) return null;

    const phonetic: string | undefined =
      entry.phonetic || entry.phonetics?.find((p: { text?: string }) => p.text)?.text;

    const audioUrl: string | undefined = entry.phonetics?.find(
      (p: { audio?: string }) => p.audio
    )?.audio;

    const definitions: Definition[] = [];
    for (const meaningGroup of entry.meanings ?? []) {
      for (const def of meaningGroup.definitions ?? []) {
        definitions.push({
          partOfSpeech: meaningGroup.partOfSpeech,
          meaning: def.definition,
          example: def.example,
        });
        if (definitions.length >= 4) break;
      }
      if (definitions.length >= 4) break;
    }

    return { word: entry.word, phonetic, audioUrl, definitions };
  } catch {
    return null;
  }
}

export async function fetchTranslation(word: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|ru`
    );
    if (!res.ok) return null;

    const data = await res.json();
    const translated: string | undefined = data?.responseData?.translatedText;
    if (!translated) return null;

    return translated;
  } catch {
    return null;
  }
}
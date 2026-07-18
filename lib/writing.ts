export interface WritingMatch {
  message: string;
  shortMessage: string;
  offset: number;
  length: number;
  replacements: string[];
  ruleId: string;
  category: string;
}

export interface WritingCheckResult {
  matches: WritingMatch[];
  errorWords: string[];
}

export async function checkWriting(text: string): Promise<WritingCheckResult | null> {
  try {
    const res = await fetch("https://api.languagetool.org/v2/check", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        text,
        language: "en-US",
      }),
    });

    if (!res.ok) return null;

    const data = await res.json();

    const matches: WritingMatch[] = (data.matches ?? []).map(
      (m: {
        message: string;
        shortMessage?: string;
        offset: number;
        length: number;
        replacements?: { value: string }[];
        rule?: { id?: string; category?: { name?: string } };
      }) => ({
        message: m.message,
        shortMessage: m.shortMessage || m.message,
        offset: m.offset,
        length: m.length,
        replacements: (m.replacements ?? []).slice(0, 3).map((r) => r.value),
        ruleId: m.rule?.id ?? "",
        category: m.rule?.category?.name ?? "Other",
      })
    );

    const errorWords = matches
      .map((m) => text.slice(m.offset, m.offset + m.length))
      .filter((w) => /^[a-zA-Z']+$/.test(w));

    return { matches, errorWords };
  } catch {
    return null;
  }
}
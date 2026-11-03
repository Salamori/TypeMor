# TypeMor

A typing trainer for learning English vocabulary. Type generated or custom
texts, mark words you don't know, and master them by typing them correctly
again in later sessions.

## Features

- **Typing practice** (`/type`) — 10/25/50/100 words at easy, medium or hard
  difficulty, or your own text. Live WPM, accuracy and timer.
- **Vocabulary** (`/vocabulary`) — words you marked, with definitions
  ([dictionaryapi.dev](https://dictionaryapi.dev)) and Russian translations
  ([MyMemory](https://mymemory.translated.net)). A word is mastered after it is
  typed correctly in 3 separate sessions.
- **Writing practice** (`/writing`) — grammar and spelling check via
  [LanguageTool](https://languagetool.org); misspelled words go to your vocabulary.
- **Progress** — points, levels and ranks, achievements with unlockable titles,
  a daily streak and daily quests on the dashboard (`/`).

All progress is stored in the browser's `localStorage`; there is no backend or
account.

## Development

Requires Node.js 20+ and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm lint
pnpm build
```

Code layout:

- `app/` — pages (Next.js App Router)
- `components/` — UI components
- `hooks/` — React hooks for the typing engine and stored progress
- `lib/` — game rules (levels, achievements, quests, streak), API clients,
  word pools, and `store.ts`, the shared `localStorage` store

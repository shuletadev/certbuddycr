# certbuddycr

Vite + React 18 + TypeScript + Tailwind app (framer-motion, lucide-react, jspdf).
UI strings are trilingual (en/es/pt) in `src/lib/i18n.tsx`.

## Commands

- `npm run dev` — dev server on http://localhost:5173
- `npm run build` — type-check (`tsc -b`) and production build

## Layout

- `src/components/<area>/` — feature folders (achievements, auth, chat, dashboard, exams, landing, layout, profile, settings, ui)
- `src/lib/` — shared logic (i18n, usage stats, etc.)
- Path alias `@/` maps to `src/`

## Working with multiple Claude accounts

This repo is worked on from two Claude accounts on one machine. Shared context lives
here (this file, `.claude/settings.json`, `.claude/skills/`), not in per-account memory.

- Commit small and often; pull/check `git status` before starting a session.
- Don't have both accounts editing the same working folder at once. Use a branch per
  account, or a `git worktree`, and merge.
- `.claude/settings.local.json` is per-machine and gitignored.

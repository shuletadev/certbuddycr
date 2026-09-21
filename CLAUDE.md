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

This repo is worked on from two Claude accounts on one machine, taking turns in the same
folder (`C:\Users\Marco\claude 2`). Shared context lives here (this file,
`.claude/commands/`, `.claude/settings.json`, `.claude/skills/`), not in per-account memory.

The user is not comfortable with git. Claude does all git work and explains it in plain,
non-technical language.

- Routine: `/start` when opening a session (syncs with GitHub), `/save` when done
  (commits and pushes). Both are in `.claude/commands/`.
- At the start of any session, if there are uncommitted changes or the branch is behind
  GitHub, tell the user in plain language and resolve it before starting new work.
- Never force-push, reset, or discard changes without an explicit yes from the user.
- Work on `main` directly; there are no long-lived branches.
- `.claude/settings.local.json` is per-machine and gitignored.

# Claude Code mods: start here

Shared notes for both Claude accounts. Written 2026-10-02, the day after mods were announced
(ClaudeDevs, Oct 1 2026). Features are new; re-check the official docs before relying on a detail.

| File | What it covers |
| --- | --- |
| [01-what-mods-are.md](01-what-mods-are.md) | What a mod is, what it can and can't do, what you need |
| [02-source-review.md](02-source-review.md) | Review of the three sources + other free repos, license and cost check |
| [03-workflow.md](03-workflow.md) | How we build mods together from two accounts, step by step |
| [04-ideas-and-inspiration.md](04-ideas-and-inspiration.md) | Idea backlog, inspiration, where to look for more |
| [05-filetree-review.md](05-filetree-review.md) | Code review of the filetree mod: safe, install it, techniques to borrow |

## One-paragraph summary

A **mod** is a small TypeScript/JavaScript module shipped inside a normal Claude Code **plugin**.
It runs inside Claude Code and can draw a side pane, a band above the prompt, a status line or
toasts, add slash commands, and block/rewrite tool calls or prompts. Mods are **free** to make and
use: no extra subscription, API key or paid service is needed (beyond Claude Code itself). Every
open-source mod we found is MIT licensed. The main risk is not cost but trust: a mod runs code on
your machine, so we only install ones we have read.

## Where things live in this repo

- `docs/mods/` — these guides
- `mods/<mod-name>/` — our own mods, one folder each (empty for now)
- `references/` (create when needed) — cloned third-party mods we study. Do not commit big clones;
  keep notes in `02-source-review.md` instead.

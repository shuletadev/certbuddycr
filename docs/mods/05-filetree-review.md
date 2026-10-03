# 05 — Code review: data-goblin/claude-code-filetree

Reviewed 2026-10-02 at version 0.2.18, commit `9bc27cd` (author Kurt Buhler, MIT). Cloned to a
scratch folder, not into this repo. About 85 KB of source: `hooks/register.tsx` (56 KB),
`git.ts`, `tree.ts`, `rows.tsx`, `icons.ts`, plus 25 tests.

## Verdict: install it, do not rebuild it

It already does what we would build, it is clean, and it is actively maintained. Re-implementing
it would cost days for a worse result. Install it as-is and spend our effort on our own mods.

**Installed 2026-10-02** (user scope, version 0.2.18) with the commands under "How to try it".
Other account/machine: run the same two `claude plugin ...` commands to get it. Settings are in
`/plugin configure filetree@claude-code-filetree`; the defaults are fine.

## Safety review

| Check | Result |
| --- | --- |
| Network access (`$.http`, `fetch`, URLs) | None |
| `eval`, dynamic code, obfuscation | None |
| File writes through `$.fs` | None (only `stat`, `read`, `list`) |
| Processes it runs | `git` (read-only status/diff), `find`, `uname`, `sh -c` (font check), `touch`/`rm -f` (its own temp marker files, macOS only), `herdr --version`, and opening a file you double-click (`Invoke-Item` on Windows) |
| Shell injection risk | Low: every command is built as an argument list, never a shell string. File names reach PowerShell through an environment variable, not the command line. |
| Reads environment | `OS`, `TMPDIR`, `HERDR_*` only |
| Changes your prompts | Yes, benignly: if a file is selected in the tree it adds a line of context ("the user has this file selected: <path>"), and `@path` mentions reveal the file in the tree. It never edits your prompt text. |
| Secrets | None in the repo |

The one thing to know: it runs `git` against your project folder constantly (scoped to the
working directory, optional locks off so it does not interfere with our own git work).

## Compatibility with our setup

- States 2.1.287+ is required; our desktop engine is 2.1.286. On 2.1.286 it **validates and
  passes all 25 tests**, but that is not the same as drawing correctly in the app. Try it before
  trusting it.
- **Tested by the user on 2026-10-02:** loaded for one session in the desktop app (engine 2.1.286,
  Windows 11) and the tree shows in the side pane. Works despite the 2.1.287 minimum.
- It explicitly supports the **desktop app** (plain Unicode icons there) and is tested on
  Windows, macOS and Linux in CI. Mods do not load in WSL sessions of the desktop app.
- Settings (activity shimmer, follow Claude, glyphs) appear in `/config` under filetree.
- A side pane it opens will share the pane area with our `party-pane`; with several panes open each
  gets a tab.

## How to try it

Safest first: load it for one session only, without installing.

    git clone https://github.com/data-goblin/claude-code-filetree.git
    git -C claude-code-filetree checkout 9bc27cd
    claude --plugin-dir ./claude-code-filetree

If we keep it: `claude plugin marketplace add data-goblin/claude-code-filetree`, then
`claude plugin install filetree@claude-code-filetree`. This is a standing config change, so ask the
user first, and re-review the diff before accepting updates (it releases often).

## Techniques worth borrowing for our own mods

1. **`Client` element for animation.** `rows.tsx` is a second file that draws and animates a region
   by itself (its own timer, pointer events) and only posts data back, so the main hook does not
   re-run on every frame. This would fix the main weakness of `party-pane`: it re-renders the whole
   pane on every tool call, which restarts the SVG animations.
2. **`userConfig` in `plugin.json`** gives a settings screen in `/config` with no UI code.
3. **Tests** with `claude plugin test` (fires events, presses buttons, no session needed) and
   `tests/surfaces.test.tsx` to run the same checks per surface (terminal, desktop).
4. **Pre-commit hook** that runs `claude plugin validate` and the tests before every commit, plus a
   GitHub Actions matrix on all three operating systems.
5. **Only ever act through argument lists, never shell strings**, and fall back safely when a
   command fails (`catch` returns a default).

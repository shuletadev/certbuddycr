# 03 — Working on mods from two accounts

Follows the repo rules in `CLAUDE.md`: work on `main`, `/start` when opening a session, `/save`
when done. Claude does the git work.

## Setup (once per Claude account)

1. Confirm Claude Code is 2.1.287 or newer (update the desktop app / CLI if mods are missing).
2. Open this folder (`C:\Users\Marco\claude 2`) and run `/start`.
3. Optional: in a terminal session run `/tui fullscreen` so side panes can show.

**Version trap (found 2026-10-02):** on this machine the `claude` command in a terminal is an old
npm install (2.1.251) that predates mods and gives false validation errors such as
`"session.start" is not an event`. The desktop app ships its own newer engine (2.1.286). Validate
with the app's copy:

    & "$env:APPDATA\Claude\claude-code\2.1.286\<hash>\claude.exe" plugin validate mods/<name>

(`<hash>` is the folder inside the version folder; the version number changes with app updates.)
Upgrading the npm CLI (`npm i -g @anthropic-ai/claude-code`) also fixes it. **Done on this machine
on 2026-10-02: the CLI is now 2.1.288 and validates all our mods.** The other account/machine may
still need the same update; check with `claude --version` (needs 2.1.287 or newer).

**Validator rule:** `$` may only be passed to functions declared at the top level of the file,
not to functions nested inside `register`.

## Where mods live

Our mods go in **`mods/<mod-name>/`** inside this repo, so both accounts share them via GitHub.

Caveat: the `plugin-authoring` skill writes new mods to a per-session scratch folder under
`~/.claude/dev-mods/<session-id>/`. That folder is per-account/per-machine and not in git. So:
ask Claude to write the mod, then have it **move or write the final files into `mods/<name>/`**
and load from there.

## Build loop

1. **Describe** the mod in plain words (see `04-ideas-and-inspiration.md`).
2. Claude loads the `plugin-authoring` skill and writes the three files.
3. Answer "Enable hot reloading for this session?" once per session (Enable).
4. Try it. Each edit reloads when the turn ends.
5. `claude plugin validate mods/<name>` — must pass before saving.
6. Add a test with `claude plugin test` for anything non-trivial.
7. `/save` to commit and push; the other account runs `/start` to pick it up.

To load a mod from the repo manually: `claude --plugin-dir ./mods/<name>`.

## Conventions

- One mod per folder, kebab-case name, with its own `README.md` (what it does, how to try it).
- Keep persistent values in `$.state` / `$.store`, never module variables.
- Always `return next(e)` when a hook has nothing to say.
- Check `e.surface` and degrade gracefully (terminal vs desktop).
- No secrets, tokens or personal paths in code; mods get committed to GitHub.
- Record decisions and findings in `docs/mods/` so neither account relies on private memory.

## Suggested first steps

1. Study filetree: clone it outside the repo (`git clone` into a temp folder), read
   `hooks/register.*` and `types/`, then load it with `--plugin-dir` and watch how the pane,
   shimmer and `prompt.submit` hook work.
2. Build `hello-tabs` from the official interface docs as a 15-minute warm-up.
3. Build a first real mod from the starter list in `04`.
4. Later: publish as a marketplace (`marketplace.json` in this or a dedicated repo).

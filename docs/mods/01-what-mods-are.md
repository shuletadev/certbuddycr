# 01 — What mods are and what you need

## What a mod is

A mod is a **plugin** whose code hooks into Claude Code's events. Three files minimum:

```
my-mod/
  .claude-plugin/plugin.json   name, version, description
  hooks/hooks.json             { "modules": ["./register.tsx"] }
  hooks/register.tsx           export function register(on) { ... }
```

Optional fourth file: `types/index.d.ts`, the type contract for values kept in `$.state`.

Inside `register`, `on(event, matcher?, hook)` adds a hook. A hook receives `($, e, next)`:
`$` is the Claude Code API, `e` is the event, `next(e)` passes control on (or return without it
to answer yourself).

## What a mod can do

| Want | Mechanism |
| --- | --- |
| Side pane / panel (like the filetree) | `$.ui.open({id})` + a `ui.render` hook on `Pane` |
| Band above the prompt | `ui.render` on `AbovePrompt` |
| Status line entry | `$.ui.status(text)` |
| Toast notification | `$.ui.toast(text)` |
| Restyle Claude's own UI (spinner, messages, tool rows) | `ui.render` on `Spinner`, `ToolUse`, etc. |
| Slash command | `$.command.register` + `command.run` hook |
| Block / rewrite / react to a tool call | `on('tool.call', ...)` |
| Rewrite or react to a prompt | `on('prompt.submit', ...)` |
| Timers, background work | `$.clock.every` |
| Ask the model something | `$.model` |
| Files, processes, network | `$.fs`, `$.process` |
| Remember things | `$.state` (session), `$.store` (across sessions) |

Elements you can draw: `Box`, `Text`, `Button`, `Input`, `Select`, `Link`, `Code` (incl. diffs),
`Markdown`, `Raster` (colored cell grids, terminal only), `Svg` (desktop only), `Image`, `Client`.

## What a mod can't do

- Change the **permission prompt** (it is not a render site, on purpose).
- Take over Tab/arrow keys or read the keyboard freely: keys reach a mod only through its focused
  controls and hotkeys.
- Unrequested panes only appear when the terminal is wide (144+ columns, 110 once the user has
  opened it themselves). Opened by a command or button press, they show at any width.
- Not every surface draws everything: `Svg` is desktop-only, `Raster`/`Image` terminal-only. Check
  `e.surface` and fall back.

## What we need

| Need | Detail | Cost |
| --- | --- | --- |
| Claude Code **2.1.287 or newer** | Terminal CLI or the desktop app's Code tab | Existing subscription |
| Node / TypeScript | Only if we build outside Claude Code; mods themselves need no build step | Free |
| Fullscreen terminal UI (`/tui fullscreen`) | Required for side panes in the terminal | Free |
| Git + GitHub | Already set up in this repo | Free |
| Nerd Font (optional) | Prettier icons; filetree falls back to Unicode | Free |

No API key, no paid service, no marketplace fee. Publishing a mod = a public GitHub repo with a
`marketplace.json`; installing = `claude plugin marketplace add <owner>/<repo>`.

## Tools Claude already has in this setup

- The **`plugin-authoring` skill** (built in). Loading it writes the API's type declarations,
  explains each pattern, and starts hot reload: describe the mod you want and Claude writes it.
- `claude plugin validate <folder>` checks a mod before loading it.
- `claude plugin test` runs automated tests (fire events, press buttons, no session needed).
- `claude --plugin-dir <folder>` loads a mod for one session without installing it.
- Hot reload: saving a file re-runs `register` and `session.start`. Keep anything that must
  survive in `$.state` / `$.store`, not module variables.

## Gotchas collected from the docs

- Props are on `e.props`, not the top level of the event.
- Return `next(e)` when you have nothing to draw so other mods still work.
- A `ui.render` hook can read `$.state` but not write it; write from `onPress`/other hooks.
- A bad element tree is silently replaced by Claude's own drawing. Check the dim transcript line
  or `claude --debug`.
- Two sessions share one `$.store`; give each item its own key to avoid overwrites.

## Official docs (primary source, free)

- Overview: https://code.claude.com/docs/en/plugins/mods/overview
- Create a mod: https://code.claude.com/docs/en/plugins/mods/create
- Draw in the interface: https://code.claude.com/docs/en/plugins/mods/interface
- Interface gallery: https://code.claude.com/docs/en/plugins/mods/gallery
- Events: https://code.claude.com/docs/en/plugins/mods/events
- API: https://code.claude.com/docs/en/plugins/mods/api
- Reference: https://code.claude.com/docs/en/plugins/mods/reference
- Test / Troubleshoot: `.../mods/test`, `.../mods/troubleshoot`
- Publish: https://code.claude.com/docs/en/plugins/publish
- Security and trust: https://code.claude.com/docs/en/plugins/security
- Full index: https://code.claude.com/docs/llms.txt

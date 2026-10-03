# party-pane

> **Status (2026-10-02): working prototype, art to be replaced.** The agent tracking and the pane
> layout work, but the owner does not like the vector characters in `hooks/art.js`. The plan is to
> replace them with real **pixel art** once the owner supplies art sources. Do not polish the
> vector art further.

A side pane that shows the agents working on your requests as illustrated characters.
Built for the Claude desktop app (Code tab), where it draws vector art. In a terminal it falls
back to plain symbols.

- **You and Claude** (the Sage) is always shown, and animates while Claude is working.
- Every subagent Claude calls in gets a character, a label for its task, and a live line saying
  what it is doing right now ("Reading i18n.tsx", "Running npm run build").
- Finished agents get a green check and leave after 30 seconds. **Clear finished** removes them now.

| Agent type | Character |
| --- | --- |
| main Claude, Plan | Sage |
| Explore | Scout |
| general-purpose | Smith |
| code-reviewer, security-auditor | Guardian |
| test-engineer | Alchemist |
| anything else | Wisp |

Open it with `/party`. It also opens on session start.

## Art

The characters are original designs drawn as SVG in `hooks/art.js`, in the style of the
commissioned reference art (thick dark outlines, flat cel shading, cyan rim light). They are not
copies of any game's characters. To add a character: add a function to `CHARACTERS`, a line in
`CAST` and `NAMES`. To preview all characters and states in a browser:

    cd mods/party-pane
    python -m http.server 8765
    # open http://127.0.0.1:8765/preview/index.html

## Try it

    claude --plugin-dir ./mods/party-pane

Validate with Claude Code 2.1.286 or newer (see `docs/mods/03-workflow.md` for the version trap).

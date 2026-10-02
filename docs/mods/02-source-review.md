# 02 — Source review and free-resource check

Reviewed 2026-10-02. "Paid?" = does using it cost money beyond Claude Code itself.

## The three sources you gave

| Source | What it is | Paid? | Notes |
| --- | --- | --- | --- |
| [data-goblin/claude-code-filetree](https://github.com/data-goblin/claude-code-filetree) | A mod: IDE-style file tree in the right sidebar. Color shimmer when Claude reads (purple) / writes (orange) / commits (green), git status with +/- line counts, search, click to open, passes selected files as context via a `prompt.submit` hook. | **No.** MIT. | Needs fullscreen mode and 110+ columns. Mouse clicks need `herdr` 0.9.1+ (free, optional). Best real-world reference for a pane with state, hotkeys and hooks. Install: `claude plugin marketplace add data-goblin/claude-code-filetree` then `claude plugin install filetree@claude-code-filetree`. |
| [@diegohaz post](https://x.com/diegohaz/status/2105753740238057531) | Reaction to the official ClaudeDevs announcement (Oct 1): he likes custom status lines showing usage limits / `ccusage` output and now wants them in the desktop app. | n/a | Confirms mods work in the **desktop app** as well as the CLI. `ccusage` is a free open-source usage tool, but we have not reviewed it. |
| [@easys_arq post](https://x.com/easys_arq/status/2105799427797696690) | Video of a heavily customized Claude look, quoting Boris Cherny (@bcherny): mods let you customize Claude "just by prompting it" and share them as plugins. | n/a | No repo linked, so no code to reuse. Reply thread not read (X login wall); worth scanning for links. |

Note: X returns "402 Payment Required" to automated fetchers. I read the posts through the in-app
browser instead. Videos could not be watched, so the visual results are unseen.

## Official source (free, authoritative)

Anthropic's docs under https://code.claude.com/docs/en/plugins/mods/ cover everything and include
worked examples (a tabbed pane, a notes pane, a Raster heat map). Anthropic also ships mods as part
of `anthropics/claude-code` per a third-party guide, not independently confirmed.

## Other open-source mod repos found (all free)

| Repo | License | What is in it |
| --- | --- | --- |
| [OneWave-AI/claude-code-mods](https://github.com/OneWave-AI/claude-code-mods) | MIT | 10 mods: burn-meter (live cost), launch-codes (confirmation for risky commands), session-wrapped (shareable stats card), boss-fight, code-pet, inner-monologue, sportscaster (audio), agent-narrator, agent-race, inbox-alerts (uses existing claude.ai connectors). Good for fun/inspiration and tool-call guard patterns. |
| [arasovic/claude-code-mods](https://github.com/arasovic/claude-code-mods) | MIT | session-meter (context/rate-limit pane), turn-footer, change-ledger, turn-timeline, compact-keeper, show-me (mermaid diagrams). Most "useful tool" oriented. |
| [konsta95/ClaudeCodeMods](https://github.com/konsta95/ClaudeCodeMods) | MIT | statusline (hoverable segments + picker), hidevalues (hides secrets in Bash rows), mod-settings (`/mods` settings pane), video (Linux only, needs ffmpeg). Uses an older env flag `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1`; likely not needed on 2.1.287+. |
| [claude.dev guide](https://claude.dev/blog/getting-started-with-claude-code-mods/) | n/a | Third-party tutorial (Token Weather, Blast Radius, Replay Theater examples). Not an Anthropic domain; cross-check against official docs. |

## Verdict on paid resources

- **Nothing here requires payment.** Mods, the API, the docs, the type declarations, testing and
  publishing are all included with Claude Code. All community repos above are MIT.
- Only optional extras cost money or effort: none found. `video` mod needs Linux + ffmpeg (free,
  but not Windows-friendly, and we are on Windows 11).
- Caveat: I only read each repo's README summary, not its code. "No paid dependency" means none
  is *mentioned*; we should skim `package.json`/hooks before installing anything.

## Trust and safety

A mod runs code inside Claude Code and can read files, run processes and use the network
(`$.fs`, `$.process`). Treat installing one like installing any program.

Rules for us:
1. Read the hooks code before installing a third-party mod. Start with `register.*`.
2. Prefer `claude --plugin-dir <local clone>` over a marketplace install while evaluating.
3. Watch for mods calling `$.process` or network APIs unrelated to their purpose.
4. Official guidance: https://code.claude.com/docs/en/plugins/security

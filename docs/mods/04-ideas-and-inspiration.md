# 04 — Ideas and inspiration

## Starter ideas (ordered easy → ambitious)

| Idea | Surface | Difficulty | Notes |
| --- | --- | --- | --- |
| Usage / limits status line | status line, band | Easy | Diego Haz's use case; `$.session.usage()` per the claude.dev guide (verify in types) |
| Danger-command confirmation | `tool.call` hook | Easy | Pattern from OneWave `launch-codes`: gate `rm -rf`, force push, prod deploys |
| Plain-English tool narrator | band / log line | Easy | Useful for a user not fluent in git/CLI, like our situation |
| Git-in-plain-language band | band | Medium | Shows "2 files changed, not saved to GitHub" and a Save button; ties into `/start` and `/save` |
| certbuddycr dev helper pane | pane | Medium | Buttons for `npm run dev` / `npm run build`, shows last build errors |
| Trilingual i18n checker | `tool.call` / pane | Medium | Warn when `src/lib/i18n.tsx` gets a key in only one of en/es/pt |
| File tree with Claude activity | pane | Hard | Reference: filetree repo; probably just install it rather than rebuild |
| Session recap card | pane / PNG | Hard | Reference: `session-wrapped` |
| Custom look (theme, spinner, message styling) | `ui.render` on built-in sites | Medium | What @easys_arq showed; restyle `Spinner`, `AssistantMessage` |

## Inspiration sources

- Official gallery: https://code.claude.com/docs/en/plugins/mods/gallery
- Announcement thread: ClaudeDevs on X (Oct 1 2026) and Boris Cherny's follow-up, linked from the
  posts in `02-source-review.md`
- Repos: OneWave-AI, arasovic, konsta95, data-goblin (links in `02`)
- Search GitHub for the topic `claude-code-mods` and for `.claude-plugin/plugin.json` files that
  contain a `modules` entry in `hooks/hooks.json`
- Anthropic's marketplaces page: https://code.claude.com/docs/en/plugins/anthropic-marketplaces

## Open questions to answer next

- Does the desktop app (Code tab) draw panes the same way? Docs say `Pane`, `AbovePrompt`,
  `Spinner` and transcript sites work in both; test it in our setup.
- Which of our installed design plugins/skills overlap with what a mod could do?
- Are there paid add-ons in any marketplace? None found so far; check the marketplace listing in
  `/plugin` inside the app.
- Read the reply threads under the two X posts for linked repos.

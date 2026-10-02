# git-status-band

A one-line band above the Claude Code prompt that says, in plain language, whether your work
is saved and matches GitHub. Read-only: it only runs `git status`, never changes anything.

| You see | It means | What to do |
| --- | --- | --- |
| ✓ Everything is saved and matches GitHub | Nothing to do | — |
| ● N files have changes that are not saved yet | Edits not committed | `/save` |
| ↑ Saved on this computer, not on GitHub yet | Committed, not pushed | `/save` |
| ↓ GitHub has newer updates | The other account pushed | `/start` |
| ⇅ Both have new work | Needs care | Ask Claude to sort it out |

It refreshes every 15 seconds, after each turn, and when you press **Refresh**. **Hide** hides it
for the session. "Behind GitHub" is based on the last time git contacted GitHub, so `/start`
(which fetches) is what makes it fully current.

## Try it

    claude --plugin-dir ./mods/git-status-band

Needs Claude Code 2.1.286 or newer with mods. Validate with `claude plugin validate mods/git-status-band`
using the same version (an older `claude` on PATH will report false errors).

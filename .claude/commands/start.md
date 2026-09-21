---
description: Sync with GitHub and report the project state in plain language
---

The user is not comfortable with git, so do all git work for them and explain results in
plain, non-technical language. Never show raw git output without translating it.

1. Run `git status` and `git fetch origin`.
2. If there are uncommitted changes (left behind by a previous session or the other
   Claude account), list which files changed and ask whether to keep them (then run the
   `/save` steps) or discard them. Never discard without an explicit yes.
3. If the local branch is behind GitHub and the working folder is clean, run
   `git pull --ff-only`. If it can't fast-forward (both sides changed), stop, explain the
   situation simply, and ask how to proceed. Do not force anything.
4. Summarize in 2-4 short lines: what was pulled in (use `git log --oneline` on the new
   commits, described in plain words), and confirm the project is up to date and ready.

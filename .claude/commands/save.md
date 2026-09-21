---
description: Commit all changes and push them to GitHub so the other account can pick them up
---

The user is not comfortable with git, so do all git work for them and explain results in
plain, non-technical language.

1. Run `git status` and `git diff`. If nothing changed, say "Nothing to save" and stop.
2. Check the changes for secrets (API keys, tokens, `.env` contents) and for files that
   shouldn't be committed (build output, `node_modules`). If anything looks wrong, stop
   and tell the user before committing.
3. Give a one-paragraph plain-language summary of what changed.
4. Stage the changes, write a short, clear commit message describing the change (end it
   with the Co-Authored-By line for Claude), and commit.
5. Run `git pull --rebase origin main` first if GitHub has newer commits, then
   `git push`. If there is a conflict or the push is rejected, stop, explain simply, and
   ask how to proceed. Never force-push.
6. Confirm in one line: what was saved and that it's on GitHub.

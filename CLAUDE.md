# CLAUDE.md

## Start here

Read `report.md` first. It is the project handoff: what the game is, how to run it, key decisions and why, current status, known issues, changelog.

## Keep report.md up to date (required)

After any meaningful change in a session, update `report.md` before finishing — the user resumes work in new chats from this file alone. Record:

- What changed (add a Changelog row with date and commit hash, or "—" if uncommitted)
- Bugs found and how they were fixed, or why they were left
- New decisions and their reasons (section 5) — especially anything a future session might "fix" by mistake
- Status changes: tests count, deploy state, what was or wasn't verified on real devices (section 6)
- Known issues added or resolved (section 7) and ideas raised (section 8)
- Update the "อัปเดตล่าสุด" date

Keep it concise; edit existing sections rather than appending duplicates. Write it in Thai, matching the current file.

## Environment

Node is installed via nvm. If `node` is not found: `export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"`.

# reel-farm

Orchestration loop (not an app itself):

1. **GPT-6 Pro** (existing ChatGPT chat) writes plans / roadmaps / repo understanding into this repo.
2. **Reel.farm** hands those files to **Luna** (standard speed, max effort) via Codex.
3. Luna implements; changes are **pushed here** before the next Pro turn.
4. Reel.farm re-prompts the **same** Pro chat with the new GitHub state for the next phase.

## Layout

- `architect/` — packs from GPT-6 Pro (plans, roadmaps, phase briefs)
- `handoffs/` — notes from Luna runs (what landed, what failed) for the next Pro prompt
- Project code lands at the repo root as Luna builds it

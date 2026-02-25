# Community SaaS Boilerplate — Governance

## Overview
This is a **community-built SaaS** where anyone can contribute ideas, code, and features. We use a **fairness-first approach** to keep contributions healthy and spam-free.

## Contribution Flow: Idea → Ticket → PR → Merge

### 1. Submit an Idea (GitHub Issue)
Use the **Idea Template**:
```
Title: [FEATURE] <name>
Component: [UI|API|Infra|Tests|Docs]
Complexity: [S|M|L]
Acceptance Criteria:
- [ ] List what "done" means
Why it matters: <1-2 sentences>
```

### 2. Community Triage
- Ideas need **≥3 upvotes** (👍 reactions) to be labeled `ready`
- Maintainers add `labeling` and can fast-track with `ready`

### 3. Contributor Runs Locally with BYO Token
- Clone repo
- Install Buildr-IDE extension (VS Code)
- Plug in your **own** LLM provider key (OpenAI / Anthropic / local)
- Run: `Buildr: Open Vibe Mode`
- Submit prompt → generates branch + commit + PR

**Your LLM costs are yours.** We pay $0.

### 4. PR Review & Merge
- CI gates: lint + typecheck + tests must pass
- 1 approval from maintainer
- Auto-merge after approval

## Fairness & Anti-Spam

### Submission Limits
- Max **5 ideas per user per day**
- Max **3 open PRs per user** at any time
- New users: max **1 PR** until first merge (probation)

### PR Rate Limit
- Max **1 PR merged per user per day** (first week)
- After **3 successful merges**: limit increases to **3/day**
- Limits reset weekly

### CI Fairness (shared resources)
- E2E tests queued by: `run-e2e` label
- Full test suite (slow): requires **1 maintainer approval**
- New contributor runs: tagged as "low-priority" in queue

### BYO Token Rules
- **API keys never go in GitHub Issues/PRs/repo**
- Use VS Code SecretStorage or env vars locally
- Keys are per-user, not shared
- No billing surprises: you control your provider + budget

## Roles & Permissions

| Role | Can | Limit |
|------|-----|-------|
| Contributor (new) | Submit ideas, comment | 1 open PR; 5 ideas/day |
| Contributor (trusted, ≥3 merges) | Submit ideas, comment, push branches | 3 open PRs; 3 merges/day (after week 1) |
| Reviewer | Label ideas, approve PRs | — |
| Maintainer | Merge, release, close/lock | — |

## Recognition

We track and celebrate contributions:
- **Weekly leaderboard:** most merged ideas
- **Monthly digest:** "Community highlights" in release notes
- **Badges:** on repo (contributor, reviewer, maintainer)

## Questions?
Open a discussion in GitHub Discussions or ask a maintainer.

---

**Remember:** This is a learning + portfolio-building exercise. Be kind, be fair, and have fun! 🚀

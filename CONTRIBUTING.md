# Contributing

Thanks for helping improve **BuildrLab Community SaaS**.

This repo aims to stay:

- **Simple** (minimal abstractions)
- **Strictly typed** (TypeScript strict)
- **Fast to run locally** (pnpm workspaces)
- **CI-friendly** (deterministic installs + reliable tests)

---

## Getting started

### Prereqs

- Node.js 20+
- pnpm 9.x

### Install

```bash
pnpm install
```

### Env

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

### Run locally

```bash
pnpm dev
```

---

## Development workflow

### Quality gates (must pass)

Before opening a PR, run:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

### Tests

- Unit tests use **Vitest**.
- E2E tests use **Playwright** and live in `apps/web/e2e/`.

Run E2E:

```bash
pnpm --filter @buildrlab/web test:e2e
```

---

## Code style

- TypeScript: **no `any`** (unless there’s a very strong reason)
- Prefer small, readable modules over clever abstractions
- Keep API handlers pure and Lambda-friendly

Formatting:

- Prettier config: `prettier.config.cjs`

---

## Commits & PRs

- Keep PRs focused (one change-set / one intent)
- Include a clear description + screenshots for UI changes
- Prefer adding/adjusting tests when changing behavior

---

## Security

- Do not commit secrets.
- Use `.env` files locally.
- Keep `ALLOW_TEST_MODE` disabled outside local/dev.

---

## Reporting issues

If you find a bug:

1. Include steps to reproduce
2. Include expected vs actual behavior
3. Add logs/screenshots when helpful

If you’re proposing a feature:

- Describe the user story
- Keep the scope tight
- Suggest a minimal implementation path

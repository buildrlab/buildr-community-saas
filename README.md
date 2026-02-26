# BuildrLab Community SaaS

Opinionated, production-lean starter for a **multi-tenant SaaS** with:

- **Web**: Next.js 16 (React 19, Tailwind v4)
- **API**: AWS Lambda-style handlers (Node.js 20) + local dev server
- **Data**: DynamoDB (single-table friendly)
- **Auth**: Cognito (JWT validation) with a safe local *test-mode* bypass
- **Infra**: Terraform modules + dev/prod envs
- **Tooling**: pnpm workspaces, TypeScript strict, ESLint, Prettier, Vitest, Playwright

This repo is designed so someone can clone it and be productive quickly:

```bash
pnpm i
pnpm dev
```

---

## Monorepo layout

- `apps/web` — Next.js app
- `apps/api` — API handlers + local dev server (simulates Lambda/API Gateway)
- `packages/shared` — Shared utilities/types
- `infra/` — Terraform modules + envs

---

## Prerequisites

- **Node.js**: 20+ (works with newer Node too)
- **pnpm**: `9.x` (see root `package.json#packageManager`)

Optional (for E2E):

- Playwright browsers: `pnpm --filter @buildrlab/web exec playwright install --with-deps`

---

## Quickstart (local dev)

### 1) Install

```bash
pnpm install
```

### 2) Configure environment

Copy the example env files:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

Common local values:

- `apps/web/.env.local`
  - `NEXT_PUBLIC_API_URL=http://localhost:3001`
  - `NEXT_PUBLIC_TEST_MODE=true` (optional)
  - `NEXT_PUBLIC_TEST_USER=dev-user` (optional)
- `apps/api/.env`
  - `AWS_REGION=us-east-1`
  - `DDB_TABLE_NAME=buildrlab-main`
  - `ALLOW_TEST_MODE=true` (optional)
  - `TEST_USER=dev-user` (optional)

> Note: **test-mode** is intended for local/dev only. In real environments, keep it disabled and use Cognito.

### 3) Run dev servers

From the repo root:

```bash
pnpm dev
```

This starts:

- Web: http://localhost:3000
- API: http://localhost:3001

---

## Scripts

At the repo root:

- `pnpm lint` — ESLint across workspaces
- `pnpm typecheck` — TypeScript checks (includes a topological build)
- `pnpm test` — Vitest unit tests across workspaces
- `pnpm build` — Production builds (Next.js + tsup)

Web-only:

- `pnpm --filter @buildrlab/web test:e2e` — Playwright E2E (see `apps/web/e2e/`)

---

## API notes

The API is written in a Lambda-friendly style (small handlers that return `{ statusCode, body }`).

For local development, `apps/api` includes a lightweight dev server that routes requests to handlers.

---

## Infrastructure (Terraform)

Terraform code lives in `infra/`:

- `infra/modules/*` — reusable modules
- `infra/envs/dev` and `infra/envs/prod` — environment compositions

This repo intentionally keeps infra setup minimal and modular; extend it to match your AWS org layout (accounts, OIDC, pipelines, etc.).

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## License

MIT — see [LICENSE](./LICENSE).

# CLAUDE.md

Instructions for agents working in this repository. Keep this file short and truthful:
if the stack or a convention changes, update it in the same commit.

## What this project is

Backend for a second-hand clothing marketplace (C2C, Vinted-like) for the **Serbian** market.
The repository is currently a skeleton: no domain code yet, only the NestJS scaffold.

Product details (monetization, shipping, i18n, mobile app) are **not settled yet** — see
`docs/product.md`, "Open questions". Do not invent them: if a task depends on an unanswered
question, ask the owner instead of silently assuming.

## Stack

- **Node.js + TypeScript 6**, `"type": "module"` — the project is pure **ESM**
- **NestJS 12** (`@nestjs/platform-express`)
- **PostgreSQL + Prisma** — the chosen ORM (ADR-0002). As of writing, the packages are
  **not installed** and `prisma/schema.prisma` is a stub. Installing it is the first data task.
- **Vitest** — unit (`*.spec.ts`) and e2e (`*.e2e-spec.ts`), globals enabled
- **oxlint** for linting, **Prettier** for formatting (single quotes, trailing commas)
- **husky + lint-staged** for git hooks, **commitlint** for commit messages
- **GitHub Actions** for CI (`.github/workflows/ci.yml`)

## Commands

```bash
npm run start:dev     # dev server, watch mode
npm run build         # nest build
npm run lint          # oxlint src/ test/
npm run lint:fix      # the same, with autofixes
npm run typecheck     # tsc --noEmit
npm run format        # prettier --write
npm run format:check  # prettier --check (what CI runs)
npm test              # unit tests (vitest run)
npm run test:watch    # unit tests in watch mode
npm run test:e2e      # e2e tests (separate config)
npm run test:cov      # coverage
```

## Hard rules

1. **ESM imports carry the `.js` extension.** `import { AppService } from './app.service.js';`
   Without it a `nodenext` build fails at runtime. This applies to tests too.
2. **No `any` in new code.** `no-explicit-any` is off in oxlint for legacy reasons — that is not
   permission to use it. If a type is hard, write it out, or use `unknown` plus narrowing.
3. **Secrets live in env only.** No keys, connection strings or tokens in code or git.
   A new environment variable goes into `.env.example` _and_ the validation schema in `src/config/`.
4. **Money is an integer in minor units** (para, `RSD` × 100), never a float. Store the currency
   next to the amount; never leave it implied.
5. **Timestamps are UTC** in the database and the API (ISO-8601). Serbian local time
   (`Europe/Belgrade`) is the client's concern.
6. **Module boundaries.** A module reaches another module only through its exported service,
   never into another module's tables or repositories. Shared code goes to `src/common`.
7. **Validate every public endpoint's input**: a DTO plus the global `ValidationPipe` with
   `whitelist: true`. Prisma entities never leave the module — return response DTOs.
8. **Never edit an applied migration.** A schema change means a new migration. See `prisma/CLAUDE.md`.

## Layout

```
src/
  main.ts            # bootstrap
  app.module.ts      # root module: wires config, database, modules/*
  config/            # configuration and env validation
  database/          # PrismaModule / PrismaService, transactions, seeds
  common/            # reusable: guards, filters, interceptors, pipes, decorators, dto, utils
  modules/           # domain modules — see src/modules/CLAUDE.md
prisma/              # schema.prisma + migrations
docs/                # product and architecture notes, ADRs
test/                # e2e tests and shared fixtures
```

Nested `CLAUDE.md` files in `src/modules/`, `src/common/`, `prisma/` and `test/` extend this one
and take precedence for files in their directory.

## Keep the docs in step with the code

Documentation that lies is worse than none: the next agent trusts it and acts on it. Update it in
the **same commit** as the change, not in a follow-up.

| What changed                                      | What to update                                                          |
| ------------------------------------------------- | ----------------------------------------------------------------------- |
| Stack, script, tool, convention                   | this file                                                               |
| A module added, removed, or renamed               | the table in `src/modules/CLAUDE.md`, `docs/architecture.md`            |
| A boundary or dependency direction                | `docs/architecture.md`, the rules in the relevant `CLAUDE.md`           |
| A decision that is expensive to reverse           | a new ADR in `docs/decisions/`; supersede the old one, never rewrite it |
| An open product question got an answer            | `docs/product.md` (move it out of "Open questions")                     |
| A roadmap item finished or reordered              | `docs/roadmap.md`                                                       |
| A new environment variable                        | `.env.example` and the validation schema in `src/config/`               |
| Schema conventions or migration workflow          | `prisma/CLAUDE.md`                                                      |
| A git hook, a CI job, or the commit convention    | the "Hooks, commits and CI" section of this file                        |
| Test layout, commands, or the test database setup | `test/CLAUDE.md`                                                        |

Two specifics that are easy to get wrong:

- **Statements about the current state expire.** This file says Prisma is not installed yet and
  `src/modules/*` is empty. Once that stops being true, fix the sentence — do not leave it for later.
- **A rule you deliberately break is a rule to change.** If a rule here no longer fits reality,
  change the rule and say why, instead of quietly working around it.

## Hooks, commits and CI

Three layers, each cheaper than the next one is thorough. The hooks are installed by
`npm install` (husky's `prepare` script) — nothing to run by hand.

| Stage        | What runs                                                  | Config                     |
| ------------ | ---------------------------------------------------------- | -------------------------- |
| `pre-commit` | prettier + oxlint **on staged files only**                 | `.lintstagedrc.json`       |
| `commit-msg` | commitlint — Conventional Commits                          | `commitlint.config.js`     |
| `pre-push`   | `npm run typecheck`, `npm test`                            | `.husky/pre-push`          |
| CI           | format, lint, typecheck, unit, build, e2e, commit messages | `.github/workflows/ci.yml` |

**Commit messages are Conventional Commits**: `type(scope): subject`, types
`build chore ci docs feat fix perf refactor revert style test`, scope free-form (usually the
module: `feat(auth): …`, `fix(orders): …`). CI re-checks every commit in a PR, so a message that
slipped past a bypassed hook still fails the build.

`--no-verify` exists for emergencies. It skips the hooks, not CI — the same checks run on the PR.

CI installs **npm 12** (`NPM_VERSION` in the workflow) before `npm ci`. Node 22 ships npm 10, which
resolves optional peer dependencies differently and rejects a lock file written by npm 12 with
`Missing: … from lock file`. Keep the pin and the npm you run locally on the same major, and
regenerate `package-lock.json` with that npm — a lock file from another major breaks every CI job
at the install step.

Line endings are LF everywhere, enforced by `.gitattributes` (`eol=lf`), including in a Windows
working tree. Without it `format:check` disagrees between a local machine and CI.

## Before calling anything done

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

All four must pass. If a test fails, say so and show the output; do not bend the test to fit
the code, and do not report a partially finished task as done.

Then check the table above: does this change make any documented statement false? If so, fix it
now, in this commit.

## Language

Documentation, code comments, identifiers and commit messages are in **English**.
The user writes in Russian — reply to them in Russian.

# Roadmap

An order, not a schedule. Each item ends with something that works and is covered by tests.

## 0. Scaffold (current stage)

- [x] NestJS 12, ESM, vitest, oxlint, prettier
- [x] Directory layout, `CLAUDE.md` files, `docs/`, ADRs
- [ ] `src/config`: env loading and validation, fail startup on invalid config
- [ ] `common/filters` + `common/dto`: one error shape, global `ValidationPipe`
- [ ] Healthcheck endpoint
- [ ] Docker Compose with PostgreSQL for local development
- [x] CI: format, lint, typecheck, test and build on every PR; git hooks and commitlint

## 1. Data and users

- [ ] Install Prisma, `migrate dev --name init`
- [ ] `User` model; `auth`: sign-up, sign-in, JWT + refresh, password reset
- [ ] `users`: profile, addresses

## 2. Listings

- [ ] `catalog`: categories, brands, sizes, condition + seeds
- [ ] `media`: photo upload (pick storage, write an ADR)
- [ ] `listings`: draft → published → withdrawn/sold
- [ ] `search`: filters, sorting, cursor pagination

## 3. The deal

Starts only after questions 1 and 2 in [product.md](./product.md) are answered — the order model
depends on the payment and shipping scheme.

- [ ] `orders`: statuses, reservation, cancellation
- [ ] `payments` — if built-in payments are chosen
- [ ] `shipping` — if carrier integration is chosen
- [ ] `reviews`: review after a completed deal

## 4. Interaction

- [ ] `chat`: conversation about a listing
- [ ] `notifications`: email + in-app
- [ ] Moderation and reports

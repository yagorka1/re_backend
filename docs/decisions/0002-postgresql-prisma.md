# ADR-0002. PostgreSQL + Prisma

- **Status:** accepted
- **Date:** 2026-09-04

## Context

The marketplace needs a database and a data-access layer: related entities (user, listing, order,
payment), money operations that require transactions, and search with filters over item attributes.
Alternatives considered for the access layer: TypeORM (native Nest integration) and Drizzle
(SQL-first).

## Decision

**PostgreSQL** as the primary database: transactions, foreign keys, JSONB for item attributes, and
full-text search that is good enough to start without a separate index.

**Prisma** as the data-access layer: a declarative schema in one file, generated types, and
predictable migrations whose history lives in the repository.

## Consequences

- The schema lives in `prisma/schema.prisma`, migrations in `prisma/migrations/`; both are committed.
- `prisma generate` is mandatory after a schema change; mismatches surface at compile time.
- Prisma is weaker at complex analytical queries — where its query builder gets in the way, use
  `$queryRaw` with parameters (never string concatenation).
- Tests that touch the database need a separate test database — see `test/CLAUDE.md`.

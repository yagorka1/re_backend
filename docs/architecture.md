# Architecture

## Shape of the system

A **modular monolith** on NestJS: one deployment, one PostgreSQL database, and inside it domain
modules with explicit boundaries (`src/modules/*`). Rationale:
[ADR-0003](./decisions/0003-modular-monolith.md).

```
HTTP (REST)
   │
   ▼
Controller ──► Service ──► Repository / Prisma ──► PostgreSQL
   │              │
   ▼              ▼
  DTO       other modules (only via their exported service)
```

Layers:

- **Controller** — transport: routes, guards, DTO validation, response mapping. No logic.
- **Service** — domain rules. The single place where invariants live.
- **Repository / Prisma** — data access. Direct Prisma calls in a service are fine while queries
  stay trivial; once a query grows, move it into a repository.

## Dependencies

Allowed import directions:

```
modules/*  ──►  common  ──►  (nothing from the project)
modules/*  ──►  database, config
```

`common` does not import `modules`. Two modules never touch each other's tables — only services.
A mutual dependency is resolved with an event or by extracting a third module, not with `forwardRef`.

## Cross-cutting decisions

| Topic | Decision |
| --- | --- |
| Configuration | env plus schema validation at boot (`src/config`); invalid config fails startup |
| Errors | one response shape, a global exception filter in `common/filters` |
| Validation | global `ValidationPipe` with `whitelist: true`, a DTO on every input |
| Money | integer minor units plus a currency code; never floats |
| Time | UTC in the database and the API, ISO-8601 on the wire |
| Identifiers | UUID/CUID externally; sequential ints are not exposed — they leak volume |
| Logs | structured JSON with a request id, no PII and no secrets |

## Not decided yet

Media storage, the search engine (Postgres FTS vs. a dedicated index), the background job queue,
and realtime transport for chat (WebSocket vs. polling). Decide each when the domain demands it,
and write an ADR for it.

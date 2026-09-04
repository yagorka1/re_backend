# ADR-0003. Modular monolith instead of microservices

- **Status:** accepted
- **Date:** 2026-09-04

## Context

The product boundaries are not settled yet (see the open questions in `docs/product.md`), the team
is small, and initial load is one region's worth. Microservices here would buy distributed
transactions and infrastructure overhead long before they buy anything useful.

## Decision

One deployment, one database, and domain modules with explicit boundaries in `src/modules/*`:
a module reaches another only through its exported service, never into another module's tables.

A layered structure inside each module (DDD with `domain/application/infrastructure`) is
deliberately not adopted: on an empty domain it produces files instead of meaning.

## Consequences

- Boundary discipline rests on review and on the rules in `src/modules/CLAUDE.md` — the compiler
  does not enforce it. A boundary violation is a review topic, not a detail.
- When a domain does hit a scaling limit, a clean module boundary lets it be extracted into a
  service without rewriting the logic. Until that happens, no infrastructure is built "for growth".
- Transactions stay local and honest, with no sagas or compensating actions.
